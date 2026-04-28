const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const schoolAuth = require("../middleware/schoolAuth.middelware");

const { addStudent, getStudents, searchSchools, getSchoolIndividualUsers } = require("../controllers/school.controller");


// route for add student by school
router.post(
  "/add-student",
  schoolAuth,
  upload.single("photo"),
  addStudent
);


// route for get student by school
router.get(
  "/students",
  schoolAuth,
  getStudents
);

// route for get school by block
router.get(
  "/search",
  searchSchools
)

router.get(
  "/individual-users",
  schoolAuth,
  getSchoolIndividualUsers
);

module.exports = router;
