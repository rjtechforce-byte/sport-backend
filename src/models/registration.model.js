const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
{
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
    required: true
  },

  type: {
    type: String,
    enum: ["individual", "school"],
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "IndividualUser"
  },

  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SchoolUser"
  },

  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student"
    }
  ]

},
{ timestamps: true }
);

module.exports = mongoose.model("Registration", registrationSchema);