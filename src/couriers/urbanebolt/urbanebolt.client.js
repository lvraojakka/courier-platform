// src/couriers/urbanebolt/urbanebolt.client.js
import axios from "axios";
import logger from "../../utils/logger.js";

class UrbaneboltClient {
  constructor() {
    this.client = axios.create({
      baseURL: process.env.URBANEBOLT_BASE_URL,
      timeout: Number(process.env.HTTP_TIMEOUT) || 10000,
    });

    this.token = null;
  }

 // Authenticate and get token
  async authenticate() {
    try {
      const response = await this.client.post(
        "/api/v1/auth/getToken/",
        {
          username: process.env.URBANEBOLT_USERNAME,
          password: process.env.URBANEBOLT_PASSWORD,
        }
      );

      this.token = response.data?.token;

      logger.info("Urbanebolt token generated");

      return this.token;
    } catch (error) {
      logger.error({
        message: "Urbanebolt authentication failed",
        error: error.message,
      });

      throw error;
    }
  }

  // Get Headers
  async request(config) {
    try {
      const headers = await this.getHeaders();

      const response = await this.client({
        ...config,
        headers: {
          ...headers,
          ...(config.headers || {}),
        },
      });

      return response.data;
    } catch (error) {
      // Auto re-authenticate on 401
      if (error.response?.status === 401) {
        logger.warn("Urbanebolt token expired. Re-authenticating");

        await this.authenticate();
        const headers = await this.getHeaders();
        const retryResponse = await this.client({
          ...config,
          headers: {
            ...headers,
            ...(config.headers || {}),
          },
        });

        return retryResponse.data;
      }

      logger.error({
        message: "Urbanebolt API Error",
        url: config.url,
        method: config.method,
        error: error.message,
      });

      throw error;
    }
  }

  /*
   * Create Order
   */
  async createShipment(payload) {
    return this.request({
      method: "POST",
      url: "/api/v1/services/manifest/",
      data: payload,
    });
  }

  /*
   * Track Order
   */
  async trackShipment(awb) {
    return this.request({
      method: "GET",
      url: `/api/v1/services/tracking-pub/?awb=${awb}`,
    });
  }

  /*
   * Cancel Order
   */
  async cancelShipment(awb) {
    return this.request({
      method: "POST",
      url: "/api/v1/services/cancel/",
      data: {
        awbs: awb,
      },
    });
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default new UrbaneboltClient();