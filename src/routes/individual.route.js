const express = require("express");
const router = express.Router();

const {
  addPerformance,
  getPerformance,
  updatePerformance,
  deletePerformance
} = require("../controllers/individual.controller");


// Add performance
router.post("/:id/performance", addPerformance);

// Get all performance
router.get("/:id/performance", getPerformance);

// Update one record
router.put("/:id/performance/:index", updatePerformance);

// Delete one record
router.delete("/:id/performance/:index", deletePerformance);

module.exports = router;