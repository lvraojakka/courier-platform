// src/middlewares/validate.middleware.js
export const validate = (schema) => (req,res,next) => {
  const { error } = schema.validate(req.body,{ abortEarly:false });

  if (error) {
    return res.status(400).json({
      success:false,
      error:{
        code:"VALIDATION_ERROR",
        message:"Invalid request payload",
        details:error.details.map((err) => ({
          field:err.path.join("."),
          message:err.message,
        })),
      },
    });
  }

  next();
};