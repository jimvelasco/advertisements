const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

// Create Schema
// 5be5f047eff1540afc58e0dd
const ImageSchema = new Schema({
  ownerid: {
    type: ObjectId
  },
  owneremail: {
    type: String
  },
  type: {
    type: String
  },
  category: {
    type: String
  },
  description: {
    type: String
  },
  imageBuffer: {
    type: Buffer,
    required: false
  },
  imageFilename: {
    type: String
  },
  width: {
    type: Number,
    required: false
  },
  height: {
    type: Number,
    required: false
  },
  child: {
    type: Number
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Image = mongoose.model("images", ImageSchema);
