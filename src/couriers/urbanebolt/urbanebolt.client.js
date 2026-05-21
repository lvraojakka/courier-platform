// src/couriers/urbanebolt/urbanebolt.client.js
import axios from
"../../config/axios.js";

class UrbaneBoltClient {

  async createOrder(payload) {
    const response = await axios.post(
    `${process.env.URBANEBOLT_BASE_URL}/orders`,
      payload,
      {
        headers: { Authorization:`Bearer TOKEN` }
      }
    );
    return response.data;
  }

  async trackOrder(awb) {
    const response = await axios.get(`${process.env.URBANEBOLT_BASE_URL}/track/${awb}`);
    return response.data;
  }

  async cancelOrder(orderId) {
    const response = await axios.post(`${process.env.URBANEBOLT_BASE_URL}/cancel/${orderId}`);
    return response.data;
  }
}

export default new UrbaneBoltClient();