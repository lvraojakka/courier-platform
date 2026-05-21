// src/models/tracking.model.js
import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema(
  {
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
    },

    status: {
      type: String,
      required: true,
    },

    rawPayload: {
      type: Object,
      default: {},
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

export default mongoose.model("Tracking", trackingSchema);
