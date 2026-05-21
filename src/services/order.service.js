//src/services/order.service.js
import { v4 as uuidv4 } from "uuid";
import Order from "../models/order.model.js";
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

      const courier = CourierFactory.getCourier(
        data.courier_partner
      );

      logger.info(
        `Calling courier API: ${data.courier_partner}`
      );

      const response = await courier.createOrder({
        ...data,
        order_id: orderId,
      });

      logger.info(
        `Courier API success: ${response.courier_order_id}`
      );

      // Persist Order
      const order = await Order.create({
        orderId,
        courierPartner: data.courier_partner,
        courierShipmentId:
          response.courier_order_id,
        awbNumber: response.awb,
        status: response.status || "CREATED",
        requestPayload: data,
        responsePayload: response,
      });

      // Append Tracking History
      await Tracking.create({
        orderId,
        awbNumber: response.awb,
        courierPartner: data.courier_partner,
        status: response.status || "CREATED",
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
      const courier = CourierFactory.getCourier(
        order.courierPartner
      );

      // Track Shipment
      const trackingData = await courier.trackOrder(
        order.awbNumber
      );

      logger.info(
        `Tracking success: ${order.awbNumber}`
      );

     // Update status
      order.status = trackingData.current_status;

      await order.save();

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
    throw new Error(
      "Maximum 100 orders allowed"
    );
  }

  const batchId = uuidv4();

  // Create Batch Record
  await Batch.create({
    batchId,
    totalOrders: orders.length,
    status: "PROCESSING",
  });
  
   // Push Jobs To Queue
  const jobs = orders.map((orderData) => ({
    name: orderData.courier_partner,
    data: {
      batchId,
      orderData,
    },
  }));

  await orderQueue.addBulk(jobs);

  logger.info(
    `Bulk order batch created: ${batchId}`
  );

  return {
    batchId,
    status: "PROCESSING",
    totalOrders: orders.length,
  };
}
}

export default OrderService;