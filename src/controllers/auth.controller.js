const IndividualUser = require('../models/IndividualUser.models');
const generateToken = require('../utils/generateToken');
const SchoolUser = require('../models/SchoolUser.moder');
const uploadToCloudinary = require("../utils/uploadToCloudinary");


exports.registerIndividual = async (req, res) => {
  try {
    const {
      name,
      fatherName,
      mobile,
      email,
      password,
      address,
      adharNumber,
      block,
      schoolName,
      schoolNumber,
      coachName,
      coachNumber,
      height,
      weight,
      dob,
      age,
      physicallyFit
    } = req.body;

    // check existing email
    const existingUser = await IndividualUser.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists"
      });
    }

    // find school
    const school = await SchoolUser.findOne({ schoolName });

    if (!school) {
      return res.status(404).json({
        message: "School not found"
      });
    }

    // auto sport from school
    const sport = school.sport;

    // upload photo
    let photo = "";

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file);
      photo = uploaded.url;
    }

    // create user
    const newUser = await IndividualUser.create({
      photo,
      name,
      fatherName,
      mobile,
      email,
      password,
      address,
      adharNumber,
      block,
      schoolName,
      schoolNumber,
      coachName,
      coachNumber,
      height,
      weight,
      dob,
      age,
      physicallyFit,
      sport
    });

    const token = generateToken(newUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      message: "Registration successful",
      token,
      user: newUser
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
};
exports.loginIndividual = async (req, res) => {

  try {

    const { email, password } = req.body;


    // 1️⃣ Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // 2️⃣ Find user
    const user = await IndividualUser.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    // 3️⃣ Password check
    const isMatch = password === user.password;

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    // 4️⃣ Generate JWT token
    const token = generateToken(user._id);

    // 5️⃣ Send token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,          //  required for HTTPS
      sameSite: "none",      //  cross-origin allow
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // 6️⃣ Response
    res.status(200).json({
      message: "Login successful",
      token,
      user
    });

  } catch (error) {

    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};

exports.registerSchool = async (req, res) => {
  try {
    const { schoolName, block, principalName, schoolNumber, schoolEmail, password, sportsInchargeName, sportsInchargeNumber, sport } = req.body;

    // cloudinary image uploade
    let photoUrl = "";
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file);
      photoUrl = uploaded.url;
    }


    // check if school already exists
    const existingSchool = await SchoolUser.findOne({ schoolEmail });

    if (existingSchool) {
      return res.status(400).json({ message: 'School with this email already exists' });
    }

    // create new school 
    const newSchool = await SchoolUser.create({
      photo: photoUrl,
      schoolName, block, principalName, schoolNumber, schoolEmail, password, sportsInchargeName, sportsInchargeNumber, sport
    });

    // generate token 
    const token = generateToken(newSchool._id);

    // set token in cookie 
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,          //  required for HTTPS
      sameSite: "none",      //  cross-origin allow
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({ message: 'School registered successfully', token, school: newSchool });
  }

  catch (error) {
    console.error('Error registring school user: ' + error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.loginSchool = async (req, res) => {

  try {

    const { email, password } = req.body;



    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const school = await SchoolUser.findOne({ schoolEmail: email });

    if (!school) {
      return res.status(400).json({
        message: "School not found"
      });
    }

    const isMatch = password === school.password;

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const token = generateToken(school._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,       //  required for HTTPS -  
      sameSite: "none",      //  cross-origin allow
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: "Login successful",
      token,
      school
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};
