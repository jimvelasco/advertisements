const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema

const AdvertisementSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  telephone: {
    type: String
  },
  address: {
    type: String
  },
  city: {
    type: String
  },

  state: {
    type: String
  },
  zip: {
    type: String
  },
  latitude: {
    type: String
  },
  longitude: {
    type: String
  },
  ownerid: {
    type: String
  },
  status: {
    type: Number
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Advertisement = mongoose.model(
  "advertisements",
  AdvertisementSchema
);
