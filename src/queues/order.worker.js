// src/queues/order.worker.js
import { Worker } from "bullmq";
import redisConnection from "../config/redis.js";
import Batch from "../models/batch.model.js";
import OrderService from "../services/order.service.js";
import logger from "../utils/logger.js";

const worker = new Worker(
  "orderQueue",

  async (job) => {
    const { batchId, orderData } = job.data;

    try {
      const order = await OrderService.createOrder(orderData);

      await Batch.updateOne(
        { batchId },
        {
          $inc: {
            processedOrders: 1,
            successOrders: 1,
          },
          $push: {
            results: {
              orderId: order.orderId,
              success: true,
            },
          },
        },
      );

      logger.info(`Bulk order processed: ${order.orderId}`);
    } catch (error) {
      await Batch.updateOne(
        { batchId },
        {
          $inc: {
            processedOrders: 1,
            failedOrders: 1,
          },
          $push: {
            results: {
              success: false,
              error: error.message,
            },
          },
        },
      );

      logger.error({
        message: "Bulk order failed",
        error: error.message,
        stack: error.stack,
      });
    }

    /*
     * Mark Batch Completed
     */
    const batch = await Batch.findOne({ batchId });

    if (batch.processedOrders === batch.totalOrders) {
      batch.status = "COMPLETED";

      await batch.save();

      logger.info(`Batch completed: ${batchId}`);
    }
  },

  {
    connection: redisConnection,

    concurrency: 20,
  },
);

export default worker;
