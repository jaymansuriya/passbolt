const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const { requireAuth } = require("./middleware/authMiddleware");
const logger = require("./helpers/logger");

dotenv.config();
const app = express();

// connect to db
async function main() {
  await mongoose
    .connect(process.env.DB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => logger.log("info", "Connected to database"))
    .catch((err) => logger.log("error", err));
  app.listen(PORT, () => {
    logger.log("info", `Server running on port ${PORT}`);
  });
}

// Import routes
const authRoutes = require("./routes/authRoutes");
const folderRoutes = require("./routes/folderRoutes");

// Middlewares
app.use(express.json());
app.use(cors());

// route Middlewares
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/folders", requireAuth, folderRoutes);


const PORT = process.env.PORT || 3000;

main();
