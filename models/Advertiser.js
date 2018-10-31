const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema

const AdvertiserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  company: {
    type: String
  },
  companyId: {
    type: String
  },
  role: {
    type: String
  },

  status: {
    type: Number,
    default: 0
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Advertiser = mongoose.model("advertisers", AdvertiserSchema);
// the users name is used for passport or when
// const User = mongoose.model("users");
// also is the name of the document in mongodb
