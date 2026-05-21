// src/config/redis.js
import Redis from "ioredis";
import logger from "../utils/logger.js";

const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null,
});

logger.info("Redis connected");

export default connection;