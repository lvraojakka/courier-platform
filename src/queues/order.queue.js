// src/queues/order.queue.js
import { Queue } from "bullmq";
import connection from "../config/redis.js";

const orderQueue = new Queue(
  "orders",
  { connection }
);

export default orderQueue;