// src/validators/order.validator.js
import Joi from "joi";

const addressSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "name is required",
    "string.empty": "name cannot be empty",
  }),

  mobile: Joi.string().required().messages({
    "any.required": "mobile is required",
    "string.empty": "mobile cannot be empty",
  }),

  email: Joi.string().email().required().messages({
    "any.required": "email is required",
    "string.email": "email must be valid",
  }),

  address: Joi.string().required().messages({
    "any.required": "address is required",
  }),

  address_type: Joi.string().optional(),

  city: Joi.string().required().messages({
    "any.required": "city is required",
  }),

  state: Joi.string().required().messages({
    "any.required": "state is required",
  }),

  country: Joi.string().optional(),

  pincode: Joi.string().required().messages({
    "any.required": "pincode is required",
  }),
});

const packageSchema = Joi.object({
  weight: Joi.number().required().messages({
    "any.required": "package.weight is required",
  }),

  length: Joi.number().required().messages({
    "any.required": "package.length is required",
  }),

  breadth: Joi.number().required().messages({
    "any.required": "package.breadth is required",
  }),

  height: Joi.number().required().messages({
    "any.required": "package.height is required",
  }),

  pieces: Joi.number().default(1),
});

export const createOrderSchema = Joi.object({
  courier_partner: Joi.string().required().messages({
    "any.required": "courier_partner is required",
    "string.empty": "courier_partner cannot be empty",
  }),

  customer: addressSchema.required(),
  package: packageSchema.required(),
  payment_mode: Joi.string()
    .valid("COD", "PREPAID")
    .required()
    .messages({
      "any.required": "payment_mode is required",
      "any.only": "payment_mode must be COD or PREPAID",
    }),
  cod_amount: Joi.number().optional(),
  declared_value: Joi.number().required().messages({
    "any.required": "declared_value is required",
  }),
  item_description: Joi.string().required().messages({
    "any.required": "item_description is required",
  }),
  service_type: Joi.string().optional(),
  invoice_number: Joi.string().required().messages({
    "any.required": "invoice_number is required",
  }),
  invoice_date: Joi.string().required().messages({
    "any.required": "invoice_date is required",
  }),
  invoice_value: Joi.number().required().messages({
    "any.required": "invoice_value is required",
  }),
  item_quantity: Joi.number().required().messages({
    "any.required": "item_quantity is required",
  }),
  return_details: addressSchema.required(),
  shipper_details: addressSchema.required(),
});

export const bulkOrderSchema = Joi.object({
  orders: Joi.array()
    .items(createOrderSchema)
    .min(1)
    .required()
    .messages({
      "array.base": "orders must be an array",
      "array.min": "At least one order is required",
      "any.required": "orders is required",
    }),
});