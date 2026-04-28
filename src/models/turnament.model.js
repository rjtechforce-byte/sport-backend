const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  date: String,
  startTime: String,
  endTime: String,
  dayType: String,
  location: String,
});

const tournamentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    tournamentType: {
      type: String,
      enum: ["individual", "team"],
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    numberOfDays: {
      type: Number,
      required: true,
    },

    schedule: [scheduleSchema], // important

    bannerImage: {
      type: String, // image URL ya filename
    },

    createdBy: {
      type: String,
      default: "District Admin",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tournament", tournamentSchema);