const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const { requireAuth } = require("./middleware/authMiddleware");
const logger = require("./helpers/logger");
const rateLimit = require("express-rate-limit");

dotenv.config();
const app = express();

// connect to db
async function main() {
    await mongoose
        .connect(
            process.env.DB_URI, {
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
const vaultRoutes = require("./routes/vaultRoutes");
const userRoutes = require("./routes/userRoutes");

// Middlewares
const limiter = rateLimit({
    max: 500,
    windowMs: 60 * 60 * 1000, // 1hr
    message: "Too many requests, please try again later",
});

let whitelist = ["https://passbolt.netlify.app/", "http://localhost:3000"];
let corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};

app.use(express.json());
app.use(cors(corsOptions));
app.use("/api", limiter);

// route Middlewares
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/folders", requireAuth, folderRoutes);
app.use("/api/v1/vaults", requireAuth, vaultRoutes);
app.use("/api/v1/users", requireAuth, userRoutes);

const PORT = process.env.PORT || 3000;

main();
