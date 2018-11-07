const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateAdvertisementInput(data) {
  let errors = {};
  // make sure everything is a string
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.description = !isEmpty(data.description) ? data.description : "";
  data.image = !isEmpty(data.image) ? data.image : "";
  data.address = !isEmpty(data.address) ? data.address : "";
  data.city = !isEmpty(data.city) ? data.city : "";
  data.state = !isEmpty(data.state) ? data.state : "";
  data.zip = !isEmpty(data.zip) ? data.zip : "";
  data.latitude = !isEmpty(data.latitude) ? data.latitude : "";
  data.longitude = !isEmpty(data.longitude) ? data.longitude : "";

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  if (Validator.isEmpty(data.description)) {
    errors.description = "Description field is required";
  }
  if (Validator.isEmpty(data.image)) {
    errors.image = "Image field is required";
  }

  if (Validator.isEmpty(data.address)) {
    errors.address = "Address field is required";
  }
  if (Validator.isEmpty(data.city)) {
    errors.city = "City field is required";
  }
  if (Validator.isEmpty(data.state)) {
    errors.state = "State field is required";
  }
  if (Validator.isEmpty(data.zip)) {
    errors.zip = "Zip field is required";
  }
  if (Validator.isEmpty(data.latitude)) {
    errors.latitude = "Latitude field is required";
  }
  if (Validator.isEmpty(data.longitude)) {
    errors.longitude = "Longitude field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
