const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema

const BusinessSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  category: {
    type: String
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  city: {
    type: String
  },

  photo: {
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

module.exports = Business = mongoose.model("businesses", BusinessSchema);
