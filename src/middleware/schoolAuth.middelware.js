const jwt = require("jsonwebtoken");
const SchoolUser = require("../models/SchoolUser.moder");

const schoolAuth = async (req, res, next) => {

  try {

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const school = await SchoolUser.findById(decoded.id);

    if (!school) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    req.school = school;

    next();

  } catch (error) {

    res.status(401).json({
      message: "Invalid token"
    });

  }

};

module.exports = schoolAuth;

