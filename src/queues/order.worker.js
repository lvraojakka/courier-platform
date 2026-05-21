// src/queues/order.worker.js
import { Worker } from "bullmq";
import connection from "../config/redis.js";
import OrderService from "../services/order.service.js";
import logger from "../utils/logger.js";

const worker = new Worker(
  "orders",
  async (job) => {
    logger.info(`Processing order: ${job.data.id}`);

    await OrderService.createOrder(job.data);
  },
  {
    connection,
    concurrency: 10,
  }
);

worker.on("completed", (job) => {
  logger.info(`Job completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
  logger.error(`Job failed: ${job?.id}`, err);
});

logger.info("Order worker started");