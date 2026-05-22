// src/models/tracking.model.js
import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    orderId: {
      type: String,
      required: true,
      index: true,
    },

    awbNumber: {
      type: String,
      required: true,
      index: true,
    },

    courierPartner: {
      type: String,
      required: true,
      index: true,
    },

    status: {
      type: String,
      required: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    eventTime: {
      type: Date,
      default: Date.now,
      index: true,
    },

    rawPayload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Tracking", trackingSchema);;