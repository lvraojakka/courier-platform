// src/couriers/interfaces/courier.interface.js
class CourierInterface {
  async createOrder(orderData) {
    throw new Error("createOrder() not implemented");
  }

  async trackOrder(awb) {
    throw new Error("trackOrder() not implemented");
  }

  async cancelOrder(awb) {
    throw new Error("cancelOrder() not implemented");
  }
}

export default CourierInterface;