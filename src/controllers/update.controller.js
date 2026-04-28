
const Update = require("../models/update.model");
const uploadToCloudinary = require("../utils/uploadToCloudinary");



exports.createUpdate = async (req, res) => {
    try {
  const { title, description,  postedBy} = req.body;
  let image =  "";
  if (req.file){
    const uploaded = await uploadToCloudinary(req.file);
    image = uploaded.url;
  }

  const update = await Update.create({
    title,
    description,
    image,
    postedBy
  })

  res.status(201).json({
    message: "update created succeccfully",
    update
  })
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}



exports.getUpdates = async (req, res) => {

  try {

    const updates = await Update.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
        message: "Updates fetched successfully",
      success: true,
      updates
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};
   


exports.deleteUpdate = async (req, res) => {

  try {

    const { id } = req.params;

    const update = await Update.findByIdAndDelete(id);

    if (!update) {
      return res.status(404).json({
        message: "Update not found"
      });
    }

    res.json({
      message: "Update deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};