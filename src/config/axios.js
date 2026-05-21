//src/config/axios.js
import axios from "axios";
import axiosRetry from "axios-retry";
import logger from "../utils/logger.js";

axiosRetry(axios, {
  retries: process.env.RETRY_COUNT || 3,
  retryDelay:
    axiosRetry.exponentialDelay,

  retryCondition: (error) => {

    logger.warn( `Retrying API request`, {
      url: error.config.url,
      method: error.config.method,
      attempt: error.config['axios-retry'] ? error.config['axios-retry'].retryCount : 0
    });

    return axiosRetry.isNetworkError(error)
      || axiosRetry.isRetryableError(error);
  }
});

export default axios;