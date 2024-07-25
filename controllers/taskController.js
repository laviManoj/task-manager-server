const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');

const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  res.json(tasks);
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;
  const task = new Task({
    title,
    description,
    status,
    user: req.user._id,
  });

  const createdTask = await task.save();
  res.status(201).json(createdTask);
});

const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;
  const task = await Task.findById(req.params.id);

  if (task) {
    task.title = title;
    task.description = description;
    task.status = status;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    if (task.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task removed' });
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

module.exports = { getTasks, createTask, updateTask, deleteTask };
