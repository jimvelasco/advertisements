const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateBusinessImageInput(data) {
  let errors = {};
  // make sure everything is a string
  data.description = !isEmpty(data.description) ? data.description : "";

  if (Validator.isEmpty(data.description)) {
    errors.description = "Business Logo Description is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
