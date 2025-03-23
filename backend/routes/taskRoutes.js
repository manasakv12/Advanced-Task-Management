const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, assignedTo, status, comments, files } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      status,
      comments: comments || [],
      files: files || [],
    });

    await task.save();

    // Emit a Socket.io event only if req.io exists
    if (req.io) req.io.emit('task-updated', task);

    res.status(201).json(task);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Assign a task to a user
router.put('/:id/assign', async (req, res) => {
  try {
    const { assignedTo } = req.body;
    
    if (!assignedTo) {
      return res.status(400).json({ message: "AssignedTo field is required" });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Emit event if Socket.io is available
    if (req.io) req.io.emit('task-updated', task);

    res.json(task);
  } catch (err) {
    console.error('Error assigning task:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await TaskModel.findByIdAndDelete(id);
    if (!deletedTask) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.put("/api/tasks/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const updatedData = req.body;

    const updatedTask = await Task.findByIdAndUpdate(taskId, updatedData, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
