// src/factories/courier.factory.js
import urbaneboltAdapter from "../couriers/urbanebolt/urbanebolt.adapter.js";
import mockcourierAdapter from "../couriers/mockcourier/mockcourier.adapter.js";
import logger from "../utils/logger.js";

class CourierFactory {
  constructor() {
    this.couriers = {
      urbanebolt: urbaneboltAdapter,
      mockcourier: mockcourierAdapter,
    };
  }

// Get Courier Adapter
  getCourier(courierPartner) {
    const courier = this.couriers[courierPartner];

    if (!courier) {
      const supportedCouriers = this.getSupportedCouriers();

      logger.error({
        message: "Unsupported courier partner",
        courierPartner,
        supportedCouriers,
      });

      const error = new Error(`Unsupported courier partner: ${courierPartner}`);
      error.statusCode = 400;
      error.code = "INVALID_COURIER_PARTNER";
      error.details = { supported_couriers: supportedCouriers };
      throw error;
    }
    return courier;
  }

  //  Supported Couriers
  getSupportedCouriers() {
    return Object.keys(this.couriers);
  }
}

export default new CourierFactory();