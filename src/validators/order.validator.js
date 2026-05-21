// src/validators/order.validator.js
import Joi from "joi";

export const createOrderSchema = Joi.object({

  order_id: Joi.string().required(),
  courier_partner: Joi.string().required(),
  customer_name: Joi.string().required(),
  address: Joi.string().required(),
});