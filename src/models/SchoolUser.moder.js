const mongoose = require("mongoose");

const schoolUserSchema = new mongoose.Schema({

  photo: String,

  schoolName: {
    type: String,
    required: true
  },

  block: String,

  principalName: String,

  schoolNumber: {
    type: String,
    required: true
  },

  schoolEmail: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  sportsInchargeName: String,
  sportsInchargeNumber: String,

  sport: {
    type: String,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("SchoolUser", schoolUserSchema);