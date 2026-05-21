// src/models/tracking.model.js
import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema({

  orderId: {
    type: String,
  },

  status: {
    type: String,
  },

  rawPayload: Object,

  timestamp: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("Tracking", trackingSchema);