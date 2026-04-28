const upload = require("../middleware/upload");
const express = require("express");
const router = express.Router();
const {createEvent, getAllEvents , deleteEvent} = require("../controllers/Event.controller");
const adminAuth = require("../middleware/adminAuth.middleware");


// create event (admin only)
router.post("/create",adminAuth , upload.single("image"), createEvent);

// get all events
router.get("/all", getAllEvents);

// delete event (admin only)
router.delete("/delete/:eventId", adminAuth, deleteEvent);



module.exports = router;