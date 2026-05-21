// src/couriers/urbanebolt/urbanebolt.adapter.js
import CourierInterface from "../interfaces/courier.interface.js";
import client from "./urbanebolt.client.js";
import {
  mapCreateOrderPayload,
  mapCreateOrderResponse,
  mapTrackingResponse,
  mapCancelResponse,
} from "./urbanebolt.mapper.js";

class UrbaneboltAdapter extends CourierInterface {
  /*
   * Create Shipment
   */
  async createOrder(orderData) {
    const payload = mapCreateOrderPayload(orderData);
    const response = await client.createShipment(payload);
    return mapCreateOrderResponse(response);
  }

  /*
   * Track Shipment
   */
  async trackOrder(awb) {
    const response = await client.trackShipment(awb);
    return mapTrackingResponse(response);
  }

  /*
   * Cancel Shipment
   */
  async cancelOrder(awb) {
    const response = await client.cancelShipment(awb);
    return mapCancelResponse(response);
  }
}

export default new UrbaneboltAdapter();