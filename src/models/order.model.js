// src/models/order.model.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

  orderId: {
    type: String,
    required: true,
    unique: true,
  },

  courierPartner: {
    type: String,
    required: true,
  },

  courierOrderId: {
    type: String,
    unique: true
  },
  awbNumber: {
    type: String,
  },

  status: {
    type: String,

    enum: [
      "CREATED",
      "PICKED_UP",
      "IN_TRANSIT",
      "DELIVERED",
      "CANCELLED",
      "FAILED"
    ],

    default: "CREATED"
  },

  requestPayload: Object,
  responsePayload: Object,

}, {
  timestamps: true
});

export default mongoose.model("Order", orderSchema);