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
});


const Task = mongoose.model("tasks", taskSchema);


function validateTask(task){
    const schema = Joi.object({
        //userId: Joi.objectId().required(),
        subject: Joi.string().min(3).max(250).required(),
        comment: Joi.string().max(500),
        priority: Joi.string(),
        dueDate: Joi.date()
    });

    return schema.validate(task);
}

module.exports.Task = Task;
module.exports.validateTask = validateTask;
