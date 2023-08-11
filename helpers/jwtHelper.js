const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const maxAge = "1h";
const createToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports = createToken;
