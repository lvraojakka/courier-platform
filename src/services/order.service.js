//src/services/order.service.js
import { v4 as uuidv4 } from "uuid";
import Order from "../models/order.model.js";
import Tracking from "../models/tracking.model.js";
import CourierFactory from "../factories/courier.factory.js";
import logger from "../utils/logger.js";
import Batch from "../models/batch.model.js";
import orderQueue from "../queues/order.queue.js";
class OrderService {
  /*
   * Create Order
   */
  static async createOrder(data) {
    try {
      const orderId = uuidv4();

      logger.info(`Creating order: ${orderId}`);

      const courier = CourierFactory.getCourier(data.courier_partner);

      logger.info(`Calling courier API: ${data.courier_partner}`);

      const response = await courier.createOrder({
        ...data,
        orderId,
      });

      logger.info(`Courier API response: ${JSON.stringify(response)}`);
      const successData = response.raw.successResponse?.[0];
      // Persist Order
      const order = await Order.create({
        orderId,
        courierPartner: data.courier_partner,
        courierShipmentId: successData?.orderNumber,
        awbNumber: successData?.awbNumber,
        status: response?.status || "CREATED",
        requestPayload: data,
        responsePayload: response,
      });

      // Append Tracking History
      await Tracking.create({
        order: order._id,
        orderId,
        awbNumber: successData?.awbNumber,
        courierPartner: data.courier_partner,
        status: response?.status || "CREATED",
        rawPayload: response,
        timestamp: new Date(),
      });

      logger.info(`Order stored in DB: ${order._id}`);

      return order;
    } catch (error) {
      logger.error({
        message: "Create order failed",
        courierPartner: data.courier_partner,
        error: error.message,
        stack: error.stack,
      });

      throw error;
    }
  }

  // Track Order
  static async trackOrder(orderId) {
    try {
      logger.info(`Tracking order: ${orderId}`);

      // Find Order
      const order = await Order.findOne({
        orderId,
      });

      if (!order) {
        throw new Error("Order not found");
      }

      // Get Courier Adapter
      const courier = CourierFactory.getCourier(order.courierPartner);

      // Fetch Tracking Data
      let trackingData = await courier.trackOrder(order.awbNumber);
      trackingData = trackingData.raw?.data;
      logger.info(`Tracking response: ${JSON.stringify(trackingData)}`);
      logger.info(`Tracking success: ${order.awbNumber}`);

      // Map Courier Status Codes
      const statusMap = {
        MAN: "CREATED",
        CAN: "CANCELLED",
        DD: "DELIVERED",
      };

      // Get Final Order Status
      const finalStatus = statusMap[trackingData.currentStatusCode] || "UNKNOWN";

      // Update Latest Order Status
      order.status = finalStatus;

      order.lastTrackedAt = new Date();

      await order.save();

      // Prevent Duplicate Tracking Entries
      const alreadyExists = await Tracking.findOne({
        orderId: order.orderId,

        status: trackingData.currentStatusCodeDescription,

        eventTime: trackingData.event_time || null,
      });

      // Append Tracking History
      if (!alreadyExists) {
        await Tracking.create({
          order: order._id,

          orderId: order.orderId,

          awbNumber: order.awbNumber,

          courierPartner: order.courierPartner,

          status: trackingData.currentStatusCodeDescription,

          description: trackingData.description || "",

          location: trackingData.location || "",

          eventTime: trackingData.event_time || new Date(),

          rawPayload: trackingData,
        });

        logger.info({
          message: "Tracking history created",
          orderId: order.orderId,
          status: trackingData.currentStatusCodeDescription,
        });
      } else {
        logger.info({
          message: "Duplicate tracking skipped",
          orderId: order.orderId,
          status: trackingData.currentStatusCodeDescription,
        });
      }

      return trackingData;
    } catch (error) {
      logger.error({
        message: "Track order failed",
        orderId,
        error: error.message,
        stack: error.stack,
      });

      throw error;
    }
  }

  // Cancel Order
  static async cancelOrder(orderId) {
    try {
      logger.info(`Cancelling order: ${orderId}`);

      // Find Order
      const order = await Order.findOne({
        orderId,
      });

      if (!order) {
        throw new Error("Order not found");
      }

      // Get Courier Adapter
      const courier = CourierFactory.getCourier(order.courierPartner);

      // Cancel Shipment
      const cancelResponse = await courier.cancelOrder(order.awbNumber);

      // Update status
      order.status = "CANCELLED";
      await order.save();

      logger.info(`Order cancelled: ${order.awbNumber}`);

      return cancelResponse;
    } catch (error) {
      logger.error({
        message: "Cancel order failed",
        orderId,
        error: error.message,
        stack: error.stack,
      });

      throw error;
    }
  }

  // Bulk Create Orders
  static async bulkCreateOrders(orders) {
    if (!Array.isArray(orders)) {
      throw new Error("Orders must be array");
    }

    if (orders.length > 100) {
      throw new Error("Maximum 100 orders allowed");
    }

    // Generate orderId if missing
    const formattedOrders = orders.map((order) => ({
      ...order,
      orderId: order.orderId || uuidv4(),
    }));

    const batchId = uuidv4();

    // Create Batch Record
    await Batch.create({
      batchId,
      totalOrders: formattedOrders.length,
      processedOrders: 0,
      successOrders: 0,
      failedOrders: 0,
      status: "PROCESSING",
      results: [],
    });

    // Push Jobs To Queue
    const jobs = formattedOrders.map((orderData) => ({
      name: orderData.courier_partner,
      data: {
        batchId,
        orderData,
      },

      opts: {
        jobId: orderData.orderId,
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },

        removeOnComplete: true,
        removeOnFail: false,
      },
    }));

    await orderQueue.addBulk(jobs);

    logger.info(`Bulk order batch created: ${batchId}`);

    return {
      batchId,
      status: "PROCESSING",
      totalOrders: formattedOrders.length,
    };
  }
}

export default OrderService;
