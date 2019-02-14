const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateAdvertisementInput(data) {
  let errors = {};
  // make sure everything is a string
  data.name = !isEmpty(data.name) ? data.name : "";
  data.description = !isEmpty(data.description) ? data.description : "";
  data.discount = !isEmpty(data.discount) ? data.discount : "";
  data.startdate = !isEmpty(data.startdate) ? data.startdate : "";

  // data.address = !isEmpty(data.address) ? data.address : "";
  // data.city = !isEmpty(data.city) ? data.city : "";
  // data.state = !isEmpty(data.state) ? data.state : "";
  // data.zip = !isEmpty(data.zip) ? data.zip : "";
  // data.latitude = !isEmpty(data.latitude) ? data.latitude : "";
  // data.longitude = !isEmpty(data.longitude) ? data.longitude : "";

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = "Description field is required";
  }
  if (Validator.isEmpty(data.discount)) {
    errors.discount = "Discount field is required";
  }
  if (Validator.isEmpty(data.startdate)) {
    errors.startdate = "Start Date field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
