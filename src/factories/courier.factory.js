// src/factories/courier.factory.js
import UrbaneBoltAdapter from "../couriers/urbanebolt/urbanebolt.adapter.js";
import MockCourierAdapter from "../couriers/mockcourier/mockcourier.adapter.js";
import logger from "../utils/logger.js";

class CourierFactory {

  static getCourier(courierPartner) {
    const couriers = {
      urbanebolt: new UrbaneBoltAdapter(),
      mockcourier: new MockCourierAdapter(),
    };

    const courier = couriers[courierPartner];

    if (!courier) {
      logger.error(`Unsupported courier partner: ${courierPartner}`);
      throw {
        status: 400,
        code: "INVALID_COURIER",
        message: "Unsupported courier partner"
      };
    }
    return courier;
  }
}

export default CourierFactory;