// src/routes/order.routes.js
import express from "express";
import {
  createOrder,
  trackOrder,
  cancelOrder,
  bulkCreateOrders,
} from "../controllers/order.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createOrderSchema } from "../validators/order.validator.js";

const router = express.Router();

router.post("/", validate(createOrderSchema), createOrder);
router.get("/:orderId/track", trackOrder);
router.post("/:orderId/cancel", cancelOrder);
router.post("/bulk", validate(createOrderSchema), bulkCreateOrders);

export default router;