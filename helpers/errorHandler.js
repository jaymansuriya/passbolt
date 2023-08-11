//handle errors
const handleErrors = (err) => {
  console.error(err.message, err.code);
  let errors = { email: "", password: "" };

  //incorrect email
  if (err.message === "incorrect email") {
    errors.email = "email you have entered is not registered!";
  }
  //incorrect password
  if (err.message === "incorrect password") {
    errors.password = "password you have entered is incorrect!";
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = "email you have entered is already registered!";
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
