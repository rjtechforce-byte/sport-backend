const Event = require("../models/Event.model");
const cloudinary = require("../services/cloudinary");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

exports.createEvent = async (req, res) => {
  try {
    console.log("FILE:", req.file);
    const { title, oneLiner, description, place, eventDate, eventTime } = req.body;

    let image = "";
    let publicId = null;

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file);

      image = uploaded.url;
      publicId = uploaded.publicId;
    }


    const chiefGuests = JSON.parse(req.body.chiefGuests || "[]");

    if (!image || !title || !oneLiner || !description || !place || !eventDate || !eventTime || chiefGuests.length === 0) {
      return res.status(400).json({
        message: "All fields are required including image and at least one chief guest",
        success: false
      });
    }

    const event = await Event.create({
      title,
      oneLiner,
      description,
      place,
      eventDate,
      eventTime,
      image,
      imagePublicId: publicId,
      chiefGuests,
      createdAtFormatted: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    });


    //  Success
    return res.status(201).json({
      success: true,
      message: "Event created successfully 🎉",
      data: event,
    });

  }

  catch (error) {
    console.error("Error creating event: ", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the event. Please try again later.",
      error: error.message
    })
  }
}


exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

    //   event not found
    if (!events || events.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No events found",
        data: [],
      });
    }

    //  Clean response 
    const formattedEvents = events.map((event) => ({
      id: event._id,
      title: event.title,
      image: event.image,
      oneLiner: event.oneLiner,
      description: event.description,
      place: event.place,
      chiefGuests: event.chiefGuests,
      eventDate: event.eventDate,
      eventTime: event.eventTime,
      createdAt: event.createdAtFormatted,
      imagePublicId: event.imagePublicId,
    }));

    //  Success response
    return res.status(200).json({
      success: true,
      count: formattedEvents.length,
      data: formattedEvents,
      message: "Events fetched successfully",
    });
  }
  catch (error) {
    console.error("Get Events Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch events",
    });
  }
}


exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    //  ID check
    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Event ID is required",
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",

      })
    }

    if (event.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(event.imagePublicId);
      } catch (err) {
        console.log("Cloudinary delete error:", err.message);
        //  ignore error but continue
      }
    }

    // delete event from db 
    await Event.findByIdAndDelete(eventId);

    return res.status(200).json({
      success: true,
      message: "event deleted successfully"

    })

  }
  catch (error) {
    console.error("Delete Event Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete event",
    });
  }
}