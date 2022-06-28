const mongoose = require("mongoose");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    maxlength: 1024,
  },
  score: {
    type: Number,
    default: 0,
  },
  forgotpasstoken: {
    type: String,
    required: false,
    trim: true,
    maxlength: 1024,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"), {
    expiresIn: "365d",
  });
  return token;
};

const User = mongoose.model("users", userSchema);

//validate user inputs

function validateUserInputs(user) {
  const complexityOption = {
    // this is used in passComp for password complexity check
    min: 6,
    max: 50,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    requirementCount: 3, // it means: Password must meet at least 3 of the complexity requirements(lower,upper,numeric are our complexity options. note that the lenght must be also greater than 8)
  };

  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().max(100).email().required(),
    //password: Joi.string().min(8).max(255).required()
    password: passwordComplexity(complexityOption, "the Password").required(),
  });

  return schema.validate(user);
}

function validateLogin(user) {
  const schema = Joi.object({
    email: Joi.string().email().max(100).required(),
    password: Joi.string().min(6).max(50).required(),
  });

  return schema.validate(user);
}

function validateResetPass(user) {
  const schema = Joi.object({
    verificationcode: Joi.string().max(10).required(),
    email: Joi.string().email().max(100).required(),
    password: Joi.string().min(6).max(50).required(),
  });

  return schema.validate(user);
}

module.exports.User = User;
module.exports.validateUserInputs = validateUserInputs;
module.exports.validateLogin = validateLogin;
module.exports.validateResetPass = validateResetPass;