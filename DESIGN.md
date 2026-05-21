# 🏗️ DESIGN DOCUMENT

## Multi Courier Integration Platform

---

# 📌 Objective

The goal of this system is to build a scalable and extensible backend platform that integrates multiple courier providers through a single unified API.

API consumers interact with one normalized contract while the platform internally manages courier-specific implementations.

The system is designed to support:

* Multiple courier integrations
* Async bulk processing
* Scalable architecture
* Clean separation of concerns
* Production-grade error handling

---

# 🏛️ High-Level Architecture

```text id="zjlwmu"
Client
   ↓
Routes
   ↓
Controllers
   ↓
Services
   ↓
Courier Factory
   ↓
Courier Adapters
   ↓
External Courier APIs
```

---

# 🧠 Architecture Overview

The application follows a layered architecture:

| Layer       | Responsibility                   |
| ----------- | -------------------------------- |
| Routes      | API endpoint mapping             |
| Controllers | Request/response handling        |
| Services    | Business logic                   |
| Factory     | Courier selection                |
| Adapters    | Courier-specific implementations |
| Models      | Database schemas                 |
| Queues      | Async background processing      |

---

# 🧩 Design Patterns Used

---

## 1️⃣ Adapter Pattern

Each courier provider exposes different request and response formats.

The Adapter Pattern is used to normalize these differences.

Example:

```text id="djlwmv"
UrbaneBoltAdapter
MockCourierAdapter
```

Each adapter implements a common interface:

```js id="bjlwmw"
createShipment()
trackShipment()
cancelShipment()
```

### ✅ Benefits

* Easy onboarding of new couriers
* Cleaner business logic
* Separation of external API concerns
* Reusable architecture

---

## 2️⃣ Strategy Pattern

The system dynamically selects a courier implementation at runtime using:

```json id="jlwmx0"
{
  "courier_partner": "urbanebolt"
}
```

This allows the application to switch courier providers without modifying core business logic.

### ✅ Benefits

* Runtime flexibility
* Open/Closed Principle compliance
* Extensible system design

---

## 3️⃣ Factory Pattern

CourierFactory is responsible for returning the correct courier adapter.

Example:

```js id="jlwmx1"
CourierFactory.getCourier("urbanebolt")
```

### ✅ Benefits

* Removes large if-else blocks
* Centralized courier registration
* Simplifies courier management

---

# 📁 Project Structure

```bash id="jlwmx2"
src/
│
├── config/
├── controllers/
├── services/
├── couriers/
├── factories/
├── models/
├── queues/
├── validators/
├── middlewares/
├── routes/
├── utils/
│
├── app.js
└── server.js
```

---

# 🗄️ Database Design

MongoDB is used because courier payloads differ between providers.

Document-based storage allows flexible schema handling while preserving raw courier payloads for debugging and auditing.

---

# 📦 Collections

---

## Orders Collection

Stores shipment information.

### Fields

| Field           | Description                |
| --------------- | -------------------------- |
| orderId         | Internal order ID          |
| courierPartner  | Courier provider           |
| courierOrderId  | Courier shipment ID        |
| awbNumber       | Tracking number            |
| status          | Shipment status            |
| requestPayload  | Raw request payload        |
| responsePayload | Raw courier response       |
| timestamps      | Created/updated timestamps |

---

## Tracking Collection

Stores append-only tracking history.

### Fields

| Field      | Description          |
| ---------- | -------------------- |
| orderId    | Internal order ID    |
| status     | Shipment status      |
| rawPayload | Raw tracking payload |
| timestamp  | Status timestamp     |

### ✅ Benefits

* Audit trail
* Shipment timeline
* Easier debugging

---

## Batch Collection

Stores metadata related to bulk order processing.

### Fields

| Field        | Description       |
| ------------ | ----------------- |
| batchId      | Unique batch ID   |
| totalOrders  | Total order count |
| successCount | Successful orders |
| failedCount  | Failed orders     |
| status       | Batch status      |

---

# ⚡ Bulk Processing Design

Bulk order creation uses BullMQ with Redis for asynchronous background processing.

---

## Processing Flow

```text id="jlwmx3"
Bulk API Request
        ↓
Request Validation
        ↓
Create Batch
        ↓
Push Jobs Into Queue
        ↓
Workers Process Concurrently
        ↓
Store Results In MongoDB
```

---

## Why Queue-Based Processing?

Processing 100 courier requests sequentially inside a single HTTP request would block the API and reduce performance.

BullMQ enables:

* Background processing
* Concurrency
* Retry support
* Better scalability
* Improved responsiveness

---

# 🔁 Retry Strategy

Axios Retry is configured with exponential backoff.

Retries occur for:

* Network failures
* Timeout errors
* 5xx responses

### Retry Flow

```text id="jlwmx4"
Try 1 → Wait 1s
Try 2 → Wait 2s
Try 3 → Wait 4s
```

### ✅ Benefits

* Better reliability
* Handles transient failures
* Reduces request failures

---

# 🛡️ Idempotency

The system prevents duplicate shipment creation using:

* Unique `orderId`
* MongoDB uniqueness constraint

Before creating a shipment, the system checks if the order already exists.

### ✅ Benefits

* Prevents duplicate courier orders
* Safe retry operations
* Consistent order state

---

# ❌ Error Handling

A centralized error middleware is implemented.

All APIs return a normalized response format.

### Example

```json id="jlwmx5"
{
  "success": false,
  "error": {
    "code": "INVALID_COURIER",
    "message": "Unsupported courier partner"
  }
}
```

---

# 📝 Logging

Winston is used for centralized logging.

Logs include:

* API failures
* Courier API failures
* Retry attempts
* Worker failures
* Validation errors

### Logged Metadata

* orderId
* courierPartner
* requestId
* error type
* stack trace

---

# 🔐 Security Considerations

* Environment-based configuration
* No hardcoded secrets
* Joi request validation
* Error sanitization
* Centralized exception handling

---

# 📈 Scalability Considerations

The system supports horizontal scalability using:

* Stateless API servers
* Queue-based processing
* Independent workers
* Redis-backed queues
* Modular courier adapters

---

# 🚀 Future Improvements

* Swagger/OpenAPI Documentation
* Docker Support
* Kubernetes Deployment
* Webhook Processing
* JWT Authentication
* Rate Limiting
* Metrics & Monitoring
* Dead Letter Queue
* Circuit Breaker Pattern

---

# ✅ Conclusion

This architecture provides a clean, scalable, and extensible multi-courier integration platform capable of supporting multiple courier providers with minimal code changes.

The system follows production-grade backend engineering practices including modular architecture, async processing, retry handling, logging, and fault tolerance.
