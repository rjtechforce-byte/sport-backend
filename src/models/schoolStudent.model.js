const mongoose = require("mongoose");
const schoolUser = require("./SchoolUser.moder")

const studentSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true
  },

  fatherName: {
    type: String,
    required: true
  },

  mobileNumber: {
    type: String,
    required: true
  },

  aadharNumber: {
    type: String,
    required: true
  },

  dob: {
    type: Date,
    required: true
  },

  age: Number,

  height: Number,

  weight: Number,

  class: String,

  sport: String,

  address: String,

  photo: String,

  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SchoolUser",
    required: true
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);