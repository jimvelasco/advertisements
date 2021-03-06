const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

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

  category: {
    type: String
  },

  categorySub1: {
    type: String,
    default: ""
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

  state: {
    type: String
  },
  zip: {
    type: String
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  advertiserId: {
    type: ObjectId
  },
  // advertiser: {
  //   type: Array
  // },
  status: {
    type: Number
  },

  // imageBuffer: {
  //   type: Buffer,
  //   required: false
  // },
  // imageFilename: {
  //   type: String
  // },
  // width: {
  //   type: Number,
  //   required: false
  // },
  // height: {
  //   type: Number,
  //   required: false
  // },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Business = mongoose.model("businesses", BusinessSchema);
