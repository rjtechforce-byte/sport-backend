const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IndividualUser",
      required: true
    },

    type: {
      type: String,
      default: "individual"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", registrationSchema);