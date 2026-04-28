const mongoose = require("mongoose");


const performanceSchema = new mongoose.Schema({

  date: String,

  sport: String,

  common: {
    attendance: String,
    stamina: Number,
    discipline: Number,
    remarks: String
  },

  stats: {
    type: Object,
    default: {}
  }

}, { _id: false });

const individualUserSchema = new mongoose.Schema({

  photo: String,

  name: {
    type: String,
    required: true
  },
  sport: String,


  fatherName: {
    type: String,
    required: true
  },

  mobile: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  adharNumber: {
    type: String,
    required: true
  },

  block: String,

  schoolName: String,
  schoolNumber: String,

  coachName: String,
  coachNumber: String,

  height: Number,
  weight: Number,

  dob: String,
  age: Number,

  physicallyFit: Boolean,
  physicalIssue: String,

  /*
     ⭐ School incharge rating
     0 / 1 / 2 / 3
   */
  rating: {
    type: Number,
    default: 0
  },

  /*
    🚀 Best player mark
  */
  promoted: {
    type: Boolean,
    default: false
  },

  /*
    🔋 Auto calculated score
    sport ke according backend set karega
  */
  batteryPower: {
    type: Object,
    default: {}
  },
  /*
    Full previous records
  */
  performance: {
    type: [performanceSchema],
    default: []
  }


}, { timestamps: true });

module.exports = mongoose.model("IndividualUser", individualUserSchema);