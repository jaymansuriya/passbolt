const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const logger = require("../helpers/logger");

dotenv.config();

const requireAuth = (req, res, next) => {
  // Get the Authorization header from the request
  const authHeader = req.headers["authorization"];

  // check json web token exists & is verified
  if (!authHeader) {
    return res.status(400).json({ error: "Bad Request" });
  }
  // Check if the header starts with 'Bearer'
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: err.message });
    }
    if (decodedToken.exp < Date.now() / 1000) {
      return res.status(401).json({ error: "Token expired" });
    }
    req.userId = decodedToken.id;
    next();
  });
};

module.exports = { requireAuth };
