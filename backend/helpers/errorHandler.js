const _ = require("lodash");

//handle errors
const handleErrors = (err) => {
  console.error(err.message, err.code);
  let errors = { };

  // incorrect username
  if (err.message === "incorrect username") {
    errors.userName = "username you have entered is not registered!";
  }
  //incorrect password
  if (err.message === "incorrect password") {
    errors.password = "password you have entered is incorrect!";
  }

  // duplicate error
  if (err.code === 11000) {
    errors.userName = `${_.get(_.keys(err.keyPattern), "0", "")} you have entered is already registered!`;
    return errors;
  }

  // validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

module.exports = handleErrors;
