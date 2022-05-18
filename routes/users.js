const { User, validateUserInputs } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const lodash = require("lodash");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  const { error } = validateUserInputs(req.body);
  if (error) res.status(400).send(error.details[0].message);

  try {
    let user = User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("Email is already used!");

    // user = new User({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password
    // });
    user = new User(lodash.pick(req.body, ["name", "email", "password"]));

    // for generating random number between two number inclusive of the both. see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    const randomNum = Math.floor(Math.random * (10 - 5 + 1) + 5); // generating random number between 5 and 10 inclusive of both 5 and 10
    // hashing the password with bcrypt lib
    const salt = await bcrypt.genSalt(randomNum);
    user.password = await bcrypt.hash(user.password, salt);

    user = await user.save();

    const token = user.generateAuthToken();
    //using cookies to stay sign in and also using confirmation email:

    res.send(lodash.pick(user, ["_id", "name", "email"]));
  } catch (e) {
    console.error(e);
    res.status(500).send("something faild please try again after a while");
  }
});

module.exports = router;
