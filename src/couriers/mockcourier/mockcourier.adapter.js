// src/couriers/mockcourier/mockcourier.adapter.js
import CourierInterface from "../interfaces/courier.interface.js";

class MockCourierAdapter extends CourierInterface {
  async createOrder(orderData) {
    return {
      courier_order_id: `MOCK-${Date.now()}`,
      awb: `AWB-${Date.now()}`,
      status: "CREATED",
      raw: orderData,
    };
  }

  async trackOrder(awb) {
    return {
      awb,
      current_status: "IN_TRANSIT",
      tracking_history: [
        {
          status: "CREATED",
          timestamp: new Date(),
        },
        {
          status: "IN_TRANSIT",
          timestamp: new Date(),
        },
      ],
    };
  }

  async cancelOrder(awb) {
    return {
      success: true,
      awb,
      message: "Shipment cancelled",
    };
  }
}

export default new MockCourierAdapter();