const User = require("../models/User");
const jwt = require("jsonwebtoken");
const handleErrors = require("../helpers/errorHandler");
const createToken = require("../helpers/jwtHelper");
const logger = require("../helpers/logger");

const signup = async (req, res) => {
  const { email, password, username, first_name, last_name } = req.body;

  try {
    const user = await User.create({ email, password, first_name, last_name, username });
    const token = createToken(user._id);
    res.status(201).json({ access_token: token });
  } catch (err) {
    const errors = handleErrors(err);
    logger.log('error', err);
    res.status(400).json({ errors });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);
    res.status(200).json({ access_token: token });
  } catch (err) {
    logger.log('error', err);
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports = {
  signup,
  login,
};
