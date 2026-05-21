//src/controllers/order.controller.js
import OrderService from "../services/order.service.js";
import logger from "../utils/logger.js";

export const createOrder = async (req,res,next) => {

  try {

    logger.info(`Create order API called` + req.body.order_id);

    const result = await OrderService.createOrder(req.body);

    logger.info(`Order created successfully` + result._id);

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};