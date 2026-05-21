// src/queues/order.queue.js
import { Queue } from "bullmq";
import redisConnection from "../config/redis.js";

const orderQueue = new Queue("orderQueue", {
  connection: redisConnection,
});

export default orderQueue;