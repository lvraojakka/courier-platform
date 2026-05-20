# 🚚 Multi Courier Integration Platform

A scalable, production-ready Multi Courier Integration Backend built with:

* Node.js (ES6+)
* Express.js
* MongoDB
* Mongoose
* BullMQ
* Redis
* Axios
* Joi
* Winston

---

## 🚀 Features

### 📦 Unified Courier APIs

* `POST /api/v1/orders` – Create shipment
* `GET /api/v1/orders/:orderId/track` – Track shipment
* `POST /api/v1/orders/:orderId/cancel` – Cancel shipment
* `POST /api/v1/orders/bulk` – Bulk shipment creation

---

### 🚛 Multi Courier Support

* UrbaneBolt Integration
* MockCourier Integration
* Plug-and-play courier architecture
* Easy onboarding for new courier providers

---

### ⚡ Bulk Order Processing

* Queue-based processing using BullMQ
* Concurrent background workers
* Supports up to 100 orders
* Partial success handling
* Idempotent order creation

---

### 🛡️ Production Features

* Retry mechanism with exponential backoff
* Centralized error handling
* Request validation using Joi
* Logging with Winston
* Config-driven architecture
* Async processing using Redis queues

---

## 🧾 Technologies

| Tech        | Description                  |
| ----------- | ---------------------------- |
| Node.js     | Backend runtime (ES6 syntax) |
| Express.js  | REST API framework           |
| MongoDB     | NoSQL database               |
| Mongoose    | MongoDB ODM                  |
| BullMQ      | Queue & background jobs      |
| Redis       | Queue backend                |
| Axios       | HTTP client                  |
| Axios Retry | Retry failed API requests    |
| Joi         | Request validation           |
| Winston     | Logging                      |
| UUID        | Batch ID generation          |

---

# 📁 Project Structure

```bash id="gubxcl"
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

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash id="x6s1z9"
git clone <repository-url>

cd courier-platform
```

---

## 2️⃣ Install Dependencies

```bash id="6mjlwm"
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file in the root directory.

```env id="xjlwm8"
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/courier_platform

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

URBANEBOLT_BASE_URL=https://api.urbanebolt.com

URBANEBOLT_API_KEY=YOUR_API_KEY

RETRY_COUNT=3
```

---

# ▶️ Running the Project

## Start API Server

```bash id="tjlwmr"
npm run dev
```

---

## Start Queue Worker

```bash id="a91msz"
npm run worker
```

---

# 📦 API Endpoints

---

## Create Order

### `POST /api/v1/orders`

### Request Body

```json id="3tv0jx"
{
  "order_id": "ORD001",
  "courier_partner": "mockcourier",
  "customer_name": "Rahul",
  "address": "Hyderabad"
}
```

---

## Track Shipment

### `GET /api/v1/orders/:orderId/track`

---

## Cancel Shipment

### `POST /api/v1/orders/:orderId/cancel`

---

## Bulk Orders

### `POST /api/v1/orders/bulk`

### Request Body

```json id="0d3e0l"
{
  "orders": [
    {
      "order_id": "ORD001",
      "courier_partner": "mockcourier",
      "customer_name": "Rahul",
      "address": "Hyderabad"
    },
    {
      "order_id": "ORD002",
      "courier_partner": "urbanebolt",
      "customer_name": "Ravi",
      "address": "Delhi"
    }
  ]
}
```

---

# 🔄 Bulk Processing Flow

```text id="t2w4nq"
Client Request
      ↓
API Validation
      ↓
BullMQ Queue
      ↓
Redis
      ↓
Worker Processes Orders Concurrently
      ↓
MongoDB Persistence
```

---

# 🔁 Retry Mechanism

Axios Retry is configured with exponential backoff.

Retries occur for:

* Network failures
* Timeout errors
* 5xx server errors

---

# 🧠 Design Patterns Used

| Pattern          | Purpose                        |
| ---------------- | ------------------------------ |
| Adapter Pattern  | Normalize courier integrations |
| Strategy Pattern | Dynamic courier selection      |
| Factory Pattern  | Centralized courier creation   |

---

# 🛡️ Error Handling

Standardized error response format:

```json id="kvjlwm"
{
  "success": false,
  "error": {
    "code": "INVALID_COURIER",
    "message": "Unsupported courier partner"
  }
}
```

---

# 🔒 Idempotency

Duplicate shipment creation is prevented using:

* Unique `orderId`
* MongoDB uniqueness constraint

---

# 📝 Logging

Winston logger is used for:

* API errors
* Courier API failures
* Worker failures
* Retry attempts

---

# ➕ Adding New Courier

Adding a new courier requires only 3 steps:

### 1️⃣ Create Adapter

```bash id="skqjlwm"
src/couriers/delhivery/delhivery.adapter.js
```

### 2️⃣ Implement Courier Interface

### 3️⃣ Register in CourierFactory

No controller or service changes are required.

---


# 👨‍💻 Author

L V Rao Jakka
