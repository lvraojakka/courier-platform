// src/models/order.model.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    courierPartner: {
      type: String,
      required: true,
    },

    courierShipmentId: {
      type: String,
    },
    awbNumber: {
      type: String,
      index: true,
    },

    status: {
      type: String,

      enum: [
        "CREATED",
        "PICKED_UP",
        "IN_TRANSIT",
        "DELIVERED",
        "CANCELLED",
        "FAILED",
      ],

      default: "CREATED",
    },

    requestPayload: {
      type: Object,
      default: {},
    },
    responsePayload: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Order", orderSchema);
