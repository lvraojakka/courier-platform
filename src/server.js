import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import logger from "./utils/logger.js";

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {

  logger.info(`Server running on port ${PORT}`);
});