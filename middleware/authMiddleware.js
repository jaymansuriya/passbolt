const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const requireAuth = (req, res, next) => {
  // Get the Authorization header from the request
  const authHeader = req.headers["authorization"];

  // check json web token exists & is verified
  if (authHeader) {
    // Check if the header starts with 'Bearer'
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log("auth error : " + err.message);
        res.status(401).json({ error: err.message });
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.status(400).json({ error: "Bad Request" });
  }
};

module.exports = { requireAuth };
