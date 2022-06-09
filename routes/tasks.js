const { Task, validateTask } = require("../models/task");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.post("/add", async (req, res) => {
  const { error } = validateTask(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  const task = new Task({
      userId: req.user._id,
      subject: req.body.subject,
      comment: req.body.comment,
      priority: req.body.priority,
      dueDate: req.body.dueDate
  });

  try{
    await task.save();
    return res.json(task);
  }catch(e){
    console.error(e);
    res.status(500).send("something faild please try again after a while");
  }
});

module.exports = router;
