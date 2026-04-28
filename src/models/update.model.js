const mongoose = require("mongoose");

const updateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    image: {
      type: String
    },

    postedBy: {
      type: String,
      default: "District Admin"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Update", updateSchema);