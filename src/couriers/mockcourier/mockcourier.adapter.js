// src/couriers/mockcourier/mockcourier.adapter.js
import CourierInterface from "../interfaces/courier.interface.js";

class MockCourierAdapter extends CourierInterface {

  async authenticate() {
    return true;
  }

  async createShipment() {

    return {
      courierOrderId: "MOCK123",
      awbNumber: "AWB123456",
      status: "CREATED"
    };
  }

  async trackShipment() {

    return {
      status: "IN_TRANSIT"
    };
  }

  async cancelShipment() {

    return {
      status: "CANCELLED"
    };
  }
}

export default MockCourierAdapter;