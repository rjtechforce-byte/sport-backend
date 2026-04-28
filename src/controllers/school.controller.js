const Student = require("../models/schoolStudent.model");
const SchoolUser = require("../models/SchoolUser.moder");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const IndividualUser = require("../models/IndividualUser.models");


/// ADD STUDENT
exports.addStudent = async (req, res) => {

  try {

    const {
      name,
      fatherName,
      mobileNumber,
      aadharNumber,
      dob,
      age,
      height,
      weight,
      class: studentClass,
      sport,
      address
    } = req.body;

    const schoolId = req.school._id;

        // cloudinary image upload
    let photoUrl = "";
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file);
      photoUrl = uploaded.url;
    }

    
    const student = await Student.create({
      name,
      fatherName,
      mobileNumber,
      aadharNumber,
      dob,
      age,
      height,
      weight,
      class: studentClass,
      sport,
      address,
      photo: photoUrl,
      schoolId
    });

    res.status(201).json({
      message: "Student added successfully",
      student
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// GET STUDETN
exports.getStudents = async (req, res) => {

  try {

    const schoolId = req.school._id;

    const students = await Student.find({
      schoolId: schoolId
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      students
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



// GET SCHOOL BY BLOCK
exports.searchSchools = async (req, res) => {
  try {
    const block = req.query.block;
    const keyword = req.query.keyword || "";

    const schools = await SchoolUser.find(
      {
        block: block,
        schoolName: { $regex: keyword, $options: "i" }
      },
      {
        _id: 1,
        schoolName: 1,
        sport: 1,
      }
    ).collation({ locale:"en", strength:2 }).limit(20);

    res.status(200).json(schools);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching schools"
    });
  }
};




exports.getSchoolIndividualUsers = async (req, res) => {
  try {
    const schoolName =
      req.school.schoolName;

    const users =
      await IndividualUser.find(
        {
          schoolName,
        },
        {
          _id: 1,
          photo: 1,
          name: 1,
          fatherName: 1,
          mobile: 1,
          age: 1,
          block: 1,
          createdAt: 1,
          email: 1,
          address: 1,
          sport: 1,

          rating: 1,
          promoted: 1,
          batteryPower: 1,
        }
      ).lean();

    res.status(200).json({
      success: true,
      count:
        users.length,
      data: users,
    });
  } catch (error) {
    console.error(
      "Get School Users Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Error fetching players",
    });
  }
};
