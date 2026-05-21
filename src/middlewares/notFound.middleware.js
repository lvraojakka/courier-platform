// src/middlewares/notFound.middleware.js
const notFoundMiddleware = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      code: "ROUTE_NOT_FOUND",
      message: `Cannot ${req.method} ${req.originalUrl}`
    }
  });
};

export default notFoundMiddleware;