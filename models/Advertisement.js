const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

// Create Schema

const AdvertisementSchema = new Schema({
  advertiserId: {
    type: ObjectId
  },
  businessId: {
    type: ObjectId
  },

  name: {
    type: String
  },
  description: {
    type: String
  },
  discount: {
    type: String
  },
  type: {
    type: String
  },
  category: {
    type: String
  },

  status: {
    type: Number
  },
  child: {
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
