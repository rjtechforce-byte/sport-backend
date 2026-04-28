const generateToken = require("../utils/generateToken");
 const Registration = require("../models/registration.model");
const Tournament = require("../models/turnament.model");
const SchoolUser = require("../models/SchoolUser.moder.js");
const IndividualUser =  require("../models/IndividualUser.models.js");

exports.adminLogin = async (req, res ) => {

    try {
        const { email, password } = req.body;

    if (
        email !== process.env.ADMIN_EMAIL || 
        password !== process.env.ADMIN_PASSWORD
        ) {
        return res.status(401).json({
            message: 'Invalid email or Password'
        })
        }

        const token = generateToken("admin");

        res.cookie("token", token,  {
  httpOnly: true,
  secure: true,          //  required for HTTPS
  sameSite: "none",      //  cross-origin allow
  maxAge: 7 * 24 * 60 * 60 * 1000
});

        res.status(200).json({
            message: "Admin Login Successfully",
            token
        })
} 

catch (error) {

    res.status(500).json({
      message: error.message
    });

    console.log(error)

  }
    }


   

exports.getTournamentRegistrations = async (req, res) => {

  try {

    const { id } = req.params;

    const registrations = await Registration.find({
      tournamentId: id
    })
    .populate({
      path: "userId",
      select: "fullName email mobileNumber photo"
    })
    .populate({
      path: "schoolId",
      select: "schoolName block sportsInchargeName sportsInchargeNumber"
    })
    .populate({
      path: "students",
      select: "name age sport height weight photo"
    });

    res.json({
      success: true,
      count: registrations.length,
      registrations
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};





exports.getDashboardStats = async (req, res) => {

  try {

    // total tournaments
    const totalTournaments = await Tournament.countDocuments();

    // total individual players
    const totalIndividuals = await Registration.countDocuments({
      type: "individual"
    });

    // total school teams
    const totalTeams = await Registration.countDocuments({
      type: "school"
    });

    // sport-wise count
    const sportWise = await Registration.aggregate([
      {
        $lookup: {
          from: "tournaments",
          localField: "tournamentId",
          foreignField: "_id",
          as: "tournament"
        }
      },
      {
        $unwind: "$tournament"
      },
      {
        $group: {
          _id: "$tournament.sportName",
          registrations: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        totalTournaments,
        totalIndividuals,
        totalTeams,
        sportWise
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};




// GET all school users
exports.getAllSchools = async (req, res) => {
  try {
    const schools = await SchoolUser.find();

    res.status(200).json({
      success: true,
      count: schools.length,
      data: schools,
    });
  } catch (error) {
    console.error("Error fetching schools:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch school users",
    });
  }
};

// GET all individual users
exports.getAllIndividuals = async (req, res) => {
  try {
    const individuals = await IndividualUser.find();

    res.status(200).json({
      success: true,
      count: individuals.length,
      data: individuals,
    });
  } catch (error) {
    console.error("Error fetching individuals:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch individual users",
    });
  }
};





//  DELETE INDIVIDUAL USER
exports.deleteIndividualUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await IndividualUser.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "Individual user not found ❌",
      });
    }

    res.status(200).json({
      message: "Individual user deleted successfully ✅",
    });

  } catch (error) {
    console.log("Delete Individual Error:", error);
    res.status(500).json({
      message: "Server error ❌",
    });
  }
};



//  DELETE SCHOOL USER
exports.deleteSchoolUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSchool = await SchoolUser.findByIdAndDelete(id);

    if (!deletedSchool) {
      return res.status(404).json({
        message: "School user not found ❌",
      });
    }

    res.status(200).json({
      message: "School user deleted successfully ✅",
    });

  } catch (error) {
    console.log("Delete School Error:", error);
    res.status(500).json({
      message: "Server error ❌",
    });
  }
};
