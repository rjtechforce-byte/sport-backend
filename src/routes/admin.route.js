const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth.middleware");
const { getTournamentRegistrations, getDashboardStats, getAllSchools, getAllIndividuals, deleteIndividualUser, deleteSchoolUser } = require("../controllers/admin.controller");
const { adminLogin,  } = require("../controllers/admin.controller");



router.post("/login", adminLogin);


router.get(
  "/tournament/:id/registrations",
  adminAuth,
  getTournamentRegistrations
);


router.get(
  "/dashboard-stats",
  adminAuth,
  getDashboardStats
);

// routes to get all school and individual user
router.get("/schools", adminAuth ,getAllSchools);
router.get("/individuals",adminAuth ,getAllIndividuals);


// route to deldete user by there id
router.delete("/individual/:id", adminAuth, deleteIndividualUser);
router.delete("/school/:id", adminAuth, deleteSchoolUser);




module.exports = router;