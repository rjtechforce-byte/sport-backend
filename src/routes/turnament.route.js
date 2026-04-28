const express = require("express");
const router = express.Router();
const { createTournament, getTournaments, registerIndividual, registerSchoolTeam } = require("../controllers/turnament.controller");
const adminAuth = require("../middleware/adminAuth.middleware");
const individualAuth = require("../middleware/individualAuth.middelware");
const schoolAuth = require("../middleware/schoolAuth.middelware");
const upload = require('../middleware/upload');

// route to create turnament
router.post("/create-tournament", adminAuth, upload.single("bannerImage"), createTournament);

// route to get all turnament

router.get("/get", getTournaments);

// route for individual registration in turnament
router.post("/register-individual",  individualAuth, registerIndividual );

// route for school team registration in turnament
router.post("/register-schoolteam",  schoolAuth, registerSchoolTeam );




module.exports = router;
