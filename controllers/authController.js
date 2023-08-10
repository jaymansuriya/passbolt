const User = require("../models/User");
const jwt = require("jsonwebtoken");
const handleErrors = require("../helpers/errorHandler");
const createToken = require("../helpers/jwtHelper");

const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.status(201).json({ access_token: token });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.status(200).json({ access_token: token });
  } catch (err) {
    console.error(err);
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports = {
  signup,
  login,
};
