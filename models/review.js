const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  comment: String,
  rating:{
    type: String,
    min: 1,
    max: 5,
  },
  created_At:{
    type: Date,
    default: Date(Date.now())
  },
  author:{
    type: Schema.Types.ObjectId,
    ref: "User"
  }
})

module.exports = mongoose.model("Review",reviewSchema);