const User = require("../models/User");
const jwt = require("jsonwebtoken");
const handleErrors = require("../helpers/errorHandler");
const createToken = require("../helpers/jwtHelper");
const logger = require("../helpers/logger");

const signup = async (req, res) => {
  const { email, password, userName, firstName, lastName } = req.body;

  try {
    const user = await User.create({ email, password, firstName, lastName, userName });
    const token = createToken(user._id);
    res.status(201).json({ access_token: token });
  } catch (err) {
    const errors = handleErrors(err);
    logger.log('error', err);
    res.status(400).json({ errors });
  }
};

const login = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await User.login(userName, password);
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
