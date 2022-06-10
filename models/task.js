const mongoose = require("mongoose");
const Joi = require("joi");

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 250,
  },
  comment: {
    type: String,
    required: false,
    default: " ",
    trim: true,
    maxlength: 500,
  },
  priority: {
    type: String,
    enum: ["very high", "high", "normal"],
    default: "normal",
  },
  dueDate: {
    type: Date,
    default: Date.now,
  },
  done: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model("tasks", taskSchema);

function validateTask(task) {
  const schema = Joi.object({
    //userId: Joi.objectId().required(),
    subject: Joi.string().min(3).max(250).required(),
    comment: Joi.string().max(500).default(" "),
    priority: Joi.string(),
    dueDate: Joi.date(),
  });

  return schema.validate(task);
}

function validateTaskId (taskId){
  const schema = Joi.object({
    _id: Joi.objectId().required()
  });
  
  return schema.validate(taskId);
}

module.exports.Task = Task;
module.exports.validateTask = validateTask;
module.exports.validateTaskId = validateTaskId;
