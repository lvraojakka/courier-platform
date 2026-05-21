import express from "express";
import helmet from "helmet";
import cors from "cors";
import apiRateLimiter from "./middlewares/rateLimit.middleware.js";
import requestLogger from "./middlewares/requestLogger.middleware.js";
import notFoundMiddleware from "./middlewares/notFound.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();

app.use(helmet());

app.use(cors());

app.use(apiRateLimiter);

app.use(express.json());

// REQUEST LOGGER
app.use(requestLogger);

// ROUTES
app.use("/api/v1/orders", orderRoutes);

// ROUTE NOT FOUND
app.use(notFoundMiddleware);

// GLOBAL ERROR HANDLER
app.use(errorMiddleware);


export default app;