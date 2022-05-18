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
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
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
    passwrod: passwordComplexity(complexityOption, "the Password").required(),
  });

  return schema.validate(user);
}

module.exports.User = User;
module.exports.validateUserInputs = validateUserInputs;
