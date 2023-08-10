const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const {requireAuth} = require("./middleware/authMiddleware");

dotenv.config();
const app = express();

// connect to db
mongoose
  .connect(process.env.DB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error(err));

// Import routes
const authRoutes = require("./routes/authRoutes");

// Middlewares
app.use(express.json());
app.use(cors());

// route Middlewares
app.use("/api/v1/auth",authRoutes);
app.get("/api/v1/users",requireAuth, (req, res) => {
  res.json({
    message: "Users",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
