// src/couriers/interfaces/courier.interface.js

class CourierInterface {

  async authenticate() {
    throw new Error("authenticate not implemented");
  }

  async createShipment(data) {
    throw new Error("createShipment not implemented");
  }

  async trackShipment(awb) {
    throw new Error("trackShipment not implemented");
  }

  async cancelShipment(orderId) {
    throw new Error("cancelShipment not implemented");
  }
}

export default CourierInterface;