// src/models/batch.model.js
import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({

  batchId: {
    type: String,
    required: true,
    unique: true,
  },

  totalOrders: {
    type: Number,
    required: true,
  },

  successCount: {
    type: Number,
    default: 0,
  },

  failedCount: {
    type: Number,
    default: 0,
  },

  status: {
    type: String,
    enum: [
      "PROCESSING",
      "COMPLETED",
      "FAILED"
    ],

    default: "PROCESSING",
  }

}, {
  timestamps: true
});

const Batch = mongoose.model("Batch",batchSchema);

export default Batch;