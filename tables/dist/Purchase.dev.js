"use strict";

var mongoose = require("mongoose");

var schema = mongoose.Schema;
var purchaseSchema = new schema({
  user: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  courseName: {
    type: [String],
    required: true
  },
  courseID: {
    type: [String],
    required: true
  },
  timeStamp: {
    type: String,
    required: true
  }
});
module.exports = Purchase = mongoose.model("purchase", purchaseSchema);