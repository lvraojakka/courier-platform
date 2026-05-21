// src/couriers/urbanebolt/urbanebolt.mapper.js
class UrbaneBoltMapper {

  static toCreateOrderPayload(data) {
    return {
      consignee_name: data.customer_name,
      delivery_address: data.address,
      order_reference: data.order_id,
    };
  }

  static toNormalizedResponse(response) {
    return {
      courierOrderId: response.shipment_id,
      awbNumber: response.awb,
      status: response.status,
    };
  }
}

export default UrbaneBoltMapper;