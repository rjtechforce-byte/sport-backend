const jwt = require("jsonwebtoken");
const IndividualUser = require("../models/IndividualUser.models");

const individualAuth = async (req, res, next) => {

  try {

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await IndividualUser.findById(decoded.id);

    if (!user) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    req.user = user;

    next();

  } catch (error) {

    res.status(401).json({
      message: "Invalid token"
    });

  }

};

module.exports = individualAuth;