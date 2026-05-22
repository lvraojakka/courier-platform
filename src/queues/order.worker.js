// queues/order.worker.js
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

      const batch = await Batch.findOneAndUpdate(
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
              error: null,
            },
          },
        },
        { new: true }
      );

      logger.info(
        `Bulk order processed: ${order.orderId}`
      );

      // Mark Batch Completed
      if (
        batch.processedOrders >= batch.totalOrders
      ) {
        batch.status = "COMPLETED";

        await batch.save();

        logger.info(
          `Batch completed: ${batchId}`
        );
      }

    } catch (error) {

      const batch = await Batch.findOneAndUpdate(
        { batchId },
        {
          $inc: {
            processedOrders: 1,
            failedOrders: 1,
          },

          $push: {
            results: {
              orderId: orderData.orderId,
              success: false,
              error: error.message,
            },
          },
        },
        { new: true }
      );

      logger.error({
        message: "Bulk order failed",
        orderId: orderData.orderId,
        error: error.message,
        stack: error.stack,
      });

      // Mark Batch Completed
      if (
        batch.processedOrders >= batch.totalOrders
      ) {
        batch.status = "COMPLETED";

        await batch.save();

        logger.info(
          `Batch completed: ${batchId}`
        );
      }
    }
  },

  {
    connection: redisConnection,
    concurrency: 10,
  }
);

export default worker;