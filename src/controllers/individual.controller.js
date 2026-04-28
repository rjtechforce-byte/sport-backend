const IndividualUser = require("../models/IndividualUser.models");
const mongoose = require("mongoose");


/* =====================================================
   ADD PERFORMANCE
   POST /api/individual-users/:id/performance
===================================================== */const addPerformance = async (req, res) => {
  try {
    const userId = req.params.id;

    /* ---------------- Validate User Id ---------------- */

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id"
      });
    }

    /* ---------------- Find User ---------------- */

    const user = await IndividualUser.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    /* ---------------- Request Body ---------------- */

    const {
      date,
      sport,
      common = {},
      stats = {},
      rating = 0,
      promoted = false
    } = req.body;

    /* ---------------- Required Validation ---------------- */

    if (!date || !sport) {
      return res.status(400).json({
        success: false,
        message: "Date and sport are required"
      });
    }

    /* ---------------- Sport Validation ---------------- */

    if (
      user.sport &&
      sport.trim().toLowerCase() !==
        user.sport.trim().toLowerCase()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Sport does not match player profile"
      });
    }

    /* ---------------- Clean Common Data ---------------- */

    const safeCommon = {
      attendance:
        common.attendance || "",

      stamina:
        Number(common.stamina) || 0,

      discipline:
        Number(common.discipline) || 0,

      remarks:
        common.remarks || ""
    };

    /* ---------------- Clean Stats ---------------- */
    /*
      Battery Power is NOT number score.
      It is latest sport strength profile.
      Example:
      {
        running:"Excellent",
        jump:"Good",
        speed:"Average"
      }
    */

    const safeStats = {};

    Object.keys(stats).forEach(
      (key) => {
        safeStats[key] =
          stats[key];
      }
    );

    /* ---------------- Performance Record ---------------- */

    const newPerformance = {
      date,
      sport,
      common: safeCommon,
      stats: safeStats
    };

    /* ---------------- Save History ---------------- */

    user.performance.push(
      newPerformance
    );

    /* ---------------- Update Latest Main Profile ---------------- */

    user.rating = Math.max(
      0,
      Math.min(
        3,
        Number(rating) || 0
      )
    );

    user.promoted =
      promoted === true ||
      promoted === "true";

    /*
      Latest batteryPower =
      latest performance stats
    */
    user.batteryPower =
      safeStats;

    /* ---------------- Save User ---------------- */

    await user.save();

    /* ---------------- Response ---------------- */

    return res.status(201).json({
      success: true,
      message:
        "Performance added successfully",

      data: {
        latestPerformance:
          user.performance[
            user.performance
              .length - 1
          ],

        latestStatus: {
          rating:
            user.rating,

          promoted:
            user.promoted,

          batteryPower:
            user.batteryPower
        }
      }
    });
  } catch (error) {
    console.error(
      "Add Performance Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error",
      error:
        error.message
    });
  }
};
/* =====================================================
   GET USER PERFORMANCE
   GET /api/individual-users/:id/performance
===================================================== */const getPerformance = async (req, res) => {
  try {
    const userId = req.params.id;

    /* ---------------- Validate User Id ---------------- */

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id"
      });
    }

    /* ---------------- Find User ---------------- */

    const user = await IndividualUser.findById(userId)
      .select(
        `
        name
        photo
        sport
        schoolName
        rating
        promoted
        batteryPower
        performance
        `
      )
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    /* ---------------- Performance History ---------------- */

    const performanceHistory =
      Array.isArray(user.performance)
        ? [...user.performance].reverse()
        : [];

    /* ---------------- Latest Record ---------------- */

    const latestPerformance =
      performanceHistory.length > 0
        ? performanceHistory[0]
        : null;

    /* ---------------- Final Response ---------------- */

    return res.status(200).json({
      success: true,
      message:
        "Performance fetched successfully",

      data: {
        /* Basic Player Info */

        player: {
          name:
            user.name || "",

          photo:
            user.photo || "",

          sport:
            user.sport || "",

          schoolName:
            user.schoolName || ""
        },

        /* Current Latest Status */

        latestStatus: {
          rating:
            user.rating || 0,

          promoted:
            user.promoted || false,

          /*
            batteryPower is object/text profile
            Example:
            {
              running:"Excellent",
              jump:"Good"
            }
          */
          batteryPower:
            user.batteryPower || {}
        },

        /* Summary */

        summary: {
          totalRecords:
            performanceHistory.length,

          latestDate:
            latestPerformance?.date ||
            null
        },

        /* Latest Performance */

        latestPerformance,

        /* Full History */

        performanceHistory
      }
    });
  } catch (error) {
    console.error(
      "Get Performance Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error",
      error:
        error.message
    });
  }
};


/* =====================================================
   UPDATE PERFORMANCE
   PUT /api/individual-users/:id/performance/:index
===================================================== */const updatePerformance = async (req, res) => {
  try {
    const { id, index } = req.params;

    /* ---------------- Validate User Id ---------------- */

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id"
      });
    }

    const recordIndex = Number(index);

    if (
      Number.isNaN(recordIndex) ||
      recordIndex < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid performance index"
      });
    }

    /* ---------------- Find User ---------------- */

    const user = await IndividualUser.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    /* ---------------- Check Record ---------------- */

    if (!user.performance[recordIndex]) {
      return res.status(404).json({
        success: false,
        message: "Performance record not found"
      });
    }

    const currentRecord =
      user.performance[recordIndex];

    /* ---------------- Request Body ---------------- */

    const {
      date,
      sport,
      common = {},
      stats = {},
      rating,
      promoted
    } = req.body;

    /* ---------------- Final Sport ---------------- */

    const finalSport =
      sport || currentRecord.sport;

    /* ---------------- Sport Validation ---------------- */

    if (
      user.sport &&
      finalSport.trim().toLowerCase() !==
        user.sport.trim().toLowerCase()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Sport does not match player profile"
      });
    }

    /* ---------------- Safe Common ---------------- */

    const safeCommon = {
      attendance:
        common.attendance ??
        currentRecord.common
          ?.attendance ??
        "",

      stamina:
        common.stamina !==
        undefined
          ? Number(
              common.stamina
            ) || 0
          : Number(
              currentRecord
                .common
                ?.stamina
            ) || 0,

      discipline:
        common.discipline !==
        undefined
          ? Number(
              common.discipline
            ) || 0
          : Number(
              currentRecord
                .common
                ?.discipline
            ) || 0,

      remarks:
        common.remarks ??
        currentRecord.common
          ?.remarks ??
        ""
    };

    /* ---------------- Safe Stats ---------------- */
    /*
      batteryPower is NOT number.
      It is latest sport strength profile.
    */

    const oldStats =
      currentRecord.stats || {};

    const safeStats = {
      ...oldStats,
      ...stats
    };

    /* ---------------- Update Record ---------------- */

    user.performance[recordIndex] = {
      date:
        date ||
        currentRecord.date,

      sport:
        finalSport,

      common:
        safeCommon,

      stats:
        safeStats
    };

    /* ---------------- Latest Status Update ---------------- */

    if (
      rating !== undefined
    ) {
      user.rating = Math.max(
        0,
        Math.min(
          3,
          Number(rating) || 0
        )
      );
    }

    if (
      promoted !==
      undefined
    ) {
      user.promoted =
        promoted === true ||
        promoted ===
          "true";
    }

    /*
      Latest batteryPower =
      latest edited stats
    */

    user.batteryPower =
      safeStats;

    /* ---------------- Save ---------------- */

    await user.save();

    /* ---------------- Response ---------------- */

    return res.status(200).json({
      success: true,
      message:
        "Performance updated successfully",

      data: {
        updatedPerformance:
          user.performance[
            recordIndex
          ],

        latestStatus: {
          rating:
            user.rating,

          promoted:
            user.promoted,

          batteryPower:
            user.batteryPower
        }
      }
    });
  } catch (error) {
    console.error(
      "Update Performance Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error",
      error:
        error.message
    });
  }
};


/* =====================================================
   DELETE PERFORMANCE
   DELETE /api/individual-users/:id/performance/:index
===================================================== */const deletePerformance = async (req, res) => {
  try {
    const { id, index } = req.params;

    /* ---------------- Validate User Id ---------------- */

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id"
      });
    }

    const recordIndex = Number(index);

    if (
      Number.isNaN(recordIndex) ||
      recordIndex < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid performance index"
      });
    }

    /* ---------------- Find User ---------------- */

    const user = await IndividualUser.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    /* ---------------- Check Record Exists ---------------- */

    if (!user.performance[recordIndex]) {
      return res.status(404).json({
        success: false,
        message: "Performance record not found"
      });
    }

    /* ---------------- Backup Deleted Record ---------------- */

    const deletedRecord =
      user.performance[recordIndex];

    /* ---------------- Delete Record ---------------- */

    user.performance.splice(
      recordIndex,
      1
    );

    /* ---------------- Update Latest Status ---------------- */

    if (
      user.performance.length > 0
    ) {
      const latestRecord =
        user.performance[
          user.performance
            .length - 1
        ];

      /*
        batteryPower is object/text profile
        so latest remaining record stats
        becomes current batteryPower
      */

      user.batteryPower =
        latestRecord.stats || {};
    } else {
      /*
        No records left
      */

      user.rating = 0;

      user.promoted = false;

      user.batteryPower =
        {};
    }

    /* ---------------- Save ---------------- */

    await user.save();

    /* ---------------- Response ---------------- */

    return res.status(200).json({
      success: true,
      message:
        "Performance deleted successfully",

      data: {
        deletedPerformance:
          deletedRecord,

        latestStatus: {
          rating:
            user.rating || 0,

          promoted:
            user.promoted ||
            false,

          batteryPower:
            user.batteryPower ||
            {}
        },

        totalRecords:
          user.performance
            .length
      }
    });
  } catch (error) {
    console.error(
      "Delete Performance Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error",
      error:
        error.message
    });
  }
};

module.exports = {
  addPerformance,
  getPerformance,
  updatePerformance,
  deletePerformance
};