import CourierInterface from "../interfaces/courier.interface.js";

import UrbaneBoltClient from "./urbanebolt.client.js";

import UrbaneBoltMapper from "./urbanebolt.mapper.js";

class UrbaneBoltAdapter
extends CourierInterface {

  async createShipment(data) {

    // INTERNAL → COURIER FORMAT
    const payload = UrbaneBoltMapper.toCreateOrderPayload(data);

    // API CALL
    const response = await UrbaneBoltClient.createOrder(payload);

    // COURIER → INTERNAL FORMAT
    return UrbaneBoltMapper.toNormalizedResponse(response);
  }
}

export default UrbaneBoltAdapter;