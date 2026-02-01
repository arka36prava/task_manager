const express = require("express");
const Task = require("../models/task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

//GET all tasks at the bottom for user
 
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Task creation
router.post("/", authMiddleware, async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      userId: req.user.userId,
      userId: req.user.userId, 
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

 // UPDATE task accoring to user
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );

    if (!task)
      return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//DELETE task (user-specific)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!task)
      return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

