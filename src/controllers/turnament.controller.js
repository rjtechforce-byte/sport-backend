const Tournament = require("../models/turnament.model");
// const Registration = require("../models/individualRegisterTurnament.model");
const Registration = require("../models/registration.model");
const IndividualUser = require("../models/IndividualUser.models");
const School = require("../models/SchoolUser.moder");
const Student = require("../models/schoolStudent.model");
const uploadToCloudinary = require("../utils/uploadToCloudinary");


exports.createTournament = async (req, res) => {
  try {
    const {
      title,
      description,
      tournamentType,
      location,
      numberOfDays,
      schedule,
    } = req.body;

    //  validation
    if (!title || !location || !tournamentType || !numberOfDays) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    // schedule parse (kyunki frontend se string aata hai)
    let parsedSchedule = [];
    if (schedule) {
      parsedSchedule = JSON.parse(schedule);
    }

    //  Cloudinary image URL
    let imageUrl = "";
    if (req.file){
      const uploaded = await uploadToCloudinary(req.file);
      imageUrl = uploaded.url;
    }

    const tournament = await Tournament.create({
      title,
      description,
      tournamentType,
      location,
      numberOfDays,
      schedule: parsedSchedule,
      bannerImage: imageUrl,
    });

    res.status(201).json({
      message: "Tournament created successfully ✅",
      tournament,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};


exports.getTournaments = async (req, res) => {

  try {

    const tournaments = await Tournament.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tournaments.length,
      tournaments
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};





exports.registerIndividual = async (req, res) => {

  // console.log("Received registration request:", req.body); // Debug log

  try {

    const { tournamentId } = req.body;

    const userId = req.user.id;
    // console.log("User ID from token:", userId); // Debug log

    const alreadyRegistered = await Registration.findOne({
      tournamentId,
      userId
    });

    if (alreadyRegistered) {
      return res.status(400).json({
        message: "Already registered for this tournament"
      });
    }


// registration create 
    const registration = await Registration.create({
      tournamentId,
      userId,
      type: "individual"
    });

  
    const user = await IndividualUser.findById(userId).select("-password");

    res.status(201).json({
      message: "Tournament registration successful",
      registration,
      user
    });

  } catch (error) {
  console.error(error);
    res.status(500).json({
      message: error.message
    });

  }

};


exports.registerSchoolTeam = async (req, res) => {

  try {

    const { tournamentId, students } = req.body;

    const schoolId = req.school._id;

    const alreadyRegistered = await Registration.findOne({
      tournamentId,
      schoolId
    });

    if (alreadyRegistered) {
      return res.status(400).json({
        message: "School already registered"
      });
    }

    // registration create
    const registration = await Registration.create({
      tournamentId,
      schoolId,
      students,
      type: "school"
    });

    // school details
    const school = await School.findById(schoolId).select("-password");

    // registredstudent details
    const studentDetails = await Student.find({
      _id: { $in: students}
    })


    res.status(201).json({
      message: "Team registered successfully",
      registration,
      school,
      studentDetails
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};