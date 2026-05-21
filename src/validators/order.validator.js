// src/validators/order.validator.js
import Joi from "joi";

export const createOrderSchema = Joi.object({
  courier_partner:Joi.string().required().messages({
    "any.required":"courier_partner is required",
    "string.empty":"courier_partner cannot be empty",
  }),

  customer:Joi.object({
    name:Joi.string().required().messages({
      "any.required":"customer.name is required",
      "string.empty":"customer.name cannot be empty",
    }),

    mobile:Joi.string().required().messages({
      "any.required":"customer.mobile is required",
      "string.empty":"customer.mobile cannot be empty",
    }),

    email:Joi.string().email().required().messages({
      "any.required":"customer.email is required",
      "string.email":"customer.email must be valid",
    }),

    address:Joi.string().required().messages({
      "any.required":"customer.address is required",
    }),

    city:Joi.string().required(),

    state:Joi.string().required(),

    pincode:Joi.string().required(),
  }).required(),

  package:Joi.object({
    weight:Joi.number().required(),
    length:Joi.number().required(),
    breadth:Joi.number().required(),
    height:Joi.number().required(),
    pieces:Joi.number().default(1),
  }).required(),

  payment_mode:Joi.string().valid("COD","PREPAID").required(),

  cod_amount:Joi.number().optional(),

  declared_value:Joi.number().required(),

  item_description:Joi.string().required(),

  invoice_number:Joi.string().required(),

  invoice_date:Joi.string().required(),

  invoice_value:Joi.number().required(),

  item_quantity:Joi.number().required(),

  return_details:Joi.object({
    name:Joi.string().required(),
    mobile:Joi.string().required(),
    email:Joi.string().required(),
    address:Joi.string().required(),
    city:Joi.string().required(),
    state:Joi.string().required(),
    pincode:Joi.string().required(),
  }).required(),

  shipper_details:Joi.object({
    name:Joi.string().required(),
    mobile:Joi.string().required(),
    email:Joi.string().required(),
    address:Joi.string().required(),
    city:Joi.string().required(),
    state:Joi.string().required(),
    pincode:Joi.string().required(),
  }).required(),
});