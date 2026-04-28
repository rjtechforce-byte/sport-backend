const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String, // Cloudinary URL
      required: true,
    },
    imagePublicId: {
  type: String,  // Cloudinary public ID for image management (deletion, updates)
  required: true,
},
    oneLiner: {
      type: String,
      required: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    chiefGuests: [
      {
        name: {
          type: String,
          required: true,
        },
        designation: {
          type: String, // IAS, MLA etc
          required: true,
        },
      },
    ],

    eventDate: {
      type: Date,
      required: true,
    },
    eventTime: {
      type: String, // e.g. "10:00 AM"
      required: true,
    },

    //  Auto created date (readable format ke liye)
    createdAtFormatted: {
      type: String,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
