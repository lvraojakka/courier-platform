// src/models/batch.model.js
import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  totalOrders: {
    type: Number,
    required: true,
  },
  processedOrders: {
    type: Number,
    default: 0,
  },
  successOrders: {
    type: Number,
    default: 0,
  },
  failedOrders: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["PENDING", "PROCESSING", "COMPLETED"],
    default: "PENDING",
  },
  results: [{
    orderId: String,
    success: Boolean,
    error: String,
  }],
}, {
  timestamps: true,
  versionKey: false,
});

export default mongoose.model("Batch", batchSchema);