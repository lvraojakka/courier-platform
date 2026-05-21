//src/services/order.service.js
import Order from "../models/order.model.js";
import CourierFactory from "../factories/courier.factory.js";
import logger from "../utils/logger.js";

class OrderService {

  static async createOrder(data) {

    logger.info(`Checking existing order` + data.order_id);

    const existingOrder = await Order.findOne({ orderId: data.order_id });

    if (existingOrder) {

      logger.warn(`Duplicate order detected` + data.order_id);
      return existingOrder;
    }

    logger.info(`Selecting courier adapter` + data.courier_partner);

    const courier = CourierFactory.getCourier(data.courier_partner);

    logger.info(`Calling courier API` + data.courier_partner);

    const response = await courier.createShipment(data);

    logger.info(`Courier API success` + response.courierOrderId);

    const order = await Order.create({

      orderId: data.order_id,
      courierPartner: data.courier_partner,
      courierOrderId: response.courierOrderId,
      awbNumber: response.awbNumber,
      status: response.status,
      requestPayload: data,
      responsePayload: response,
    });

    logger.info(`Order stored in database` + order._id);

    return order;
  }
}

export default OrderService;