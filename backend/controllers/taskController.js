const Task = require("../models/Task");

const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const fileUrl = req.file ? req.file.path : null; // Get uploaded file URL

    const task = new Task({
      title,
      description,
      file: fileUrl, // Save file URL in MongoDB
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTask };
