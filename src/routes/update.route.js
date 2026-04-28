const express = require("express");
const router = express.Router();
const upload = require('../middleware/upload');
const adminAuth = require("../middleware/adminAuth.middleware");
const { createUpdate , getUpdates, deleteUpdate} = require("../controllers/update.controller");


// route to create update
router.post("/upload", adminAuth, upload.single('image'), createUpdate);

// route to get all updates
router.get("/get", getUpdates );

// route to delete update
router.delete("/delete/:id", adminAuth, deleteUpdate);



module.exports = router;