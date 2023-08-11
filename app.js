const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const { requireAuth } = require("./middleware/authMiddleware");
const logger = require("./helpers/logger");

dotenv.config();
const app = express();

// connect to db
async function connectToDatabase() {
  await mongoose
    .connect(process.env.DB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => logger.log("info", "Connected to database"))
    .catch((err) => logger.log("error", err));
}
connectToDatabase();

// Import routes
const authRoutes = require("./routes/authRoutes");

// Middlewares
app.use(express.json());
app.use(cors());

// route Middlewares
app.use("/api/v1/auth", authRoutes);
app.get("/api/v1/users", requireAuth, (req, res) => {
  res.json({
    message: "Users",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.log("info", `Server running on port ${PORT}`);
});
