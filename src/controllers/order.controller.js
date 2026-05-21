//src/controllers/order.controller.js
import OrderService from "../services/order.service.js";
import logger from "../utils/logger.js";

// Create Order
export const createOrder = async (req,res,next) => {
  try {
    logger.info(`Create order API called`);
    const order = await OrderService.createOrder(req.body);
    logger.info(`Order created successfully: ${order._id}`);
    res.status(201).json({ success:true,data:order });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// Track Order
export const trackOrder = async (req,res,next) => {
  try {
    const { orderId } = req.params;
    logger.info(`Track order API called: ${orderId}`);
    const tracking = await OrderService.trackOrder(orderId);
    logger.info(`Tracking fetched successfully: ${orderId}`);
    res.status(200).json({ success:true,data:tracking });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// Cancel Order
export const cancelOrder = async (req,res,next) => {
  try {
    const { orderId } = req.params;
    logger.info(`Cancel order API called: ${orderId}`);
    const cancelledOrder = await OrderService.cancelOrder(orderId);
    logger.info(`Order cancelled successfully: ${orderId}`);
    res.status(200).json({ success:true,data:cancelledOrder });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

// Bulk Create Orders
export const bulkCreateOrders = async (req,res,next) => {
  try {
    logger.info(`Bulk create orders API called`);
    const batch = await OrderService.bulkCreateOrders(req.body);
    logger.info(`Bulk batch created: ${batch.batchId}`);
    res.status(202).json({ success:true,data:batch });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};


