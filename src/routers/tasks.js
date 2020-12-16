const express = require('express');

const router = new express.Router();
const Task = require('../models/tasks');
const authMiddleware = require('../middleware/auth');

router.post('/tasks', authMiddleware, async (req, res) => {
  // const task = new Task(req.body);

  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();

    res.status(200).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/tasks', authMiddleware, async (req, res) => {
  const userID = req.user._id;
  try {
    /* const tasks = await Task.find({ owner: req.user._id })

		if (!tasks) {
			res.status(400).send();
		}
		res.send(tasks)
    */
    await req.user.populate({
      path: 'tasks',
      match: {
        completed: true,
      },
    }).execPopulate();
    // await req.user.populate('tasks').execPopulate();
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/tasks/:id', authMiddleware, async (req, res) => {
  const _id = req.params.id;

  try {
    // const findTask = await Task.findById(_id)
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(400).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch('/tasks/:id', authMiddleware, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedTaskUpdate = ['completed', 'description'];
  const isValid = updates.every((value) => allowedTaskUpdate.includes(value));

  if (!isValid) {
    return res.status(400).send({ error: 'Invalid updates' });
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }
    updates.forEach((update) => task[update] = req.body[update]);
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const deleteTask = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!deleteTask) {
      return res.status(404).send();
    }
    res.send(deleteTask);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
