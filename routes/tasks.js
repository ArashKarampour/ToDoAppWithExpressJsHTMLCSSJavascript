const { Task, validateTask,validateTaskId } = require("../models/task");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.post("/add", async (req, res) => {
  const { error } = validateTask(req.body);
  if(error) return res.status(400).json(error.details[0].message);
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
    return res.status(500).json("something faild please try again after a while");
  }
});

router.delete("/delete/:taskId", async (req,res) => {
  //console.log(req.params.taskId);
  const { error } = validateTaskId({_id: req.params.taskId});
  if(error) return res.status(400).json(error.details[0].message);
  try{
    const deletedTask = await Task.findByIdAndRemove(req.params.taskId);
    console.log(deletedTask);
    return res.json(deletedTask);
  }catch(e){
    console.error(e);
    return res.status(500).json("something faild please try again after a while");
  }
});

module.exports = router;
