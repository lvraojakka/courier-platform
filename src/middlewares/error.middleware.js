//src/middlewares/error.middleware.js
import logger from "../utils/logger.js";

const errorMiddleware = (err,req,res,next) => {

  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
  });

  res.status(err.status || 500).json({
    success: false,
    error: {
      code:
        err.code || "INTERNAL_SERVER_ERROR",

      message:
        err.message || "Something went wrong"
    }
  });
};

export default errorMiddleware;