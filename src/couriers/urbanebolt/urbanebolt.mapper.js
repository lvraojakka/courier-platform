// src/couriers/urbanebolt/urbanebolt.mapper.js
export const mapCreateOrderPayload = (data) => {
  return [{
    customerCode: process.env.URBANEBOLT_CUSTOMER_CODE || "UEBCUS0008",
    orderNumber: data.orderId,
    declaredValue: data.declared_value || 0,
    itemDescription: data.item_description || "PRODUCT",
    collectableValue: data.cod_amount || 0,
    height: data.package.height || 10,
    length: data.package.length || 10,
    breadth: data.package.breadth || 10,
    weight: data.package.weight || 1,
    pieces: data.package.pieces || 1,
    serviceType: data.service_type || "SDD",
    payMode: data.payment_mode || "PREPAID",
    invoiceNumber: data.invoice_number || data.orderId,
    invoiceDate: data.invoice_date || new Date().toISOString().split("T")[0],
    invoiceValue: data.invoice_value || 0,
    itemQuantity: data.item_quantity || 1,
    rtnName: data.return_details.name || "",
    rtnMobile: data.return_details.mobile || "",
    rtnEmail: data.return_details.email || "",
    rtnAddress: data.return_details.address || "",
    rtnAddressType: data.return_details.address_type || "Seller",
    rtnCity: data.return_details.city || "",
    rtnState: data.return_details.state || "",
    rtnCountry: data.return_details.country || "INDIA",
    rtnPincode: data.return_details.pincode || "",
    shprName: data.shipper_details.name || "",
    shprMobile: data.shipper_details.mobile || "",
    shprEmail: data.shipper_details.email || "",
    shprAddress: data.shipper_details.address || "",
    shprAddressType: data.shipper_details.address_type || "Seller",
    shprCity: data.shipper_details.city || "",
    shprState: data.shipper_details.state || "",
    shprCountry: data.shipper_details.country || "INDIA",
    shprPincode: data.shipper_details.pincode || "",
    consName: data.customer.name || "",
    consMobile: data.customer.mobile || "",
    consEmail: data.customer.email || "",
    consAddress: data.customer.address || "",
    consAddressType: data.customer.address_type || "Home",
    consCity: data.customer.city || "",
    consState: data.customer.state || "",
    consCountry: data.customer.country || "INDIA",
    consPincode: data.customer.pincode || "",
  }];
};

export const mapCreateOrderResponse = (response) => {
  return {
    courier_order_id: response.orderNumber || null,
    awb: response.awbNumber || null,
    status: response.successResponse?.length ? "CREATED" : "FAILED",
    raw: response,
  };
};

export const mapTrackingResponse = (response) => {
  return {
    awb: response.awbNumber || null,
    current_status: response.currentStatusCodeDescription || null,
    tracking_history: response.trackingHistory || [],
    raw: response,
  };
};

export const mapCancelResponse = (response) => {
  return {
    success: true,
    message: response.message || "Shipment cancelled",
    raw: response,
  };
};