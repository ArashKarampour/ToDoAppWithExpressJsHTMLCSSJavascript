const { User, validateUserInputs, validateLogin } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const lodash = require("lodash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("config");
const mailgun = require("mailgun-js");
const DOMAIN = "sandbox4711c7ec37104b2faa5731b099109750.mailgun.org";
const mg = mailgun({ apiKey: config.get("Mailgun_API_Key"), domain: DOMAIN });

//const port = require("../index.js");

router.post("/register", async (req, res) => {
  const { error } = validateUserInputs(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("Email is already used!");

    user = new User(lodash.pick(req.body, ["name", "email", "password"]));

    // for generating random number between two number inclusive of the both. see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    const randomNum = Math.floor(Math.random * (10 - 5 + 1) + 5); // generating random number between 5 and 10 inclusive of both 5 and 10
    // hashing the password with bcrypt lib
    const salt = await bcrypt.genSalt(randomNum);
    user.password = await bcrypt.hash(user.password, salt);

    user = await user.save();

    const token = user.generateAuthToken();
    //using cookies to stay sign in and also using confirmation email:
    //res.cookie("token", token);
    const data = {
      from: "todo.app@gmail.com",
      to: req.body.email,
      subject: "Hello",
      html: `
        <h2>Please clike on the link to activate your account</h2>
        <a style="color:green;border-radius:5px" href=${config.get(
          "UrlBase"
        )}:${config.get("Port")}/api/todo/users/verify/${token}>Verify</a>
      `,
      //text: "Testing some Mailgun awesomness!",
    };
    mg.messages().send(data, function (error, body) {
      if (error) console.log("Couldn't send email!", error);
      console.log(body);
    });

    //res.send(lodash.pick(user, ["_id", "name", "email"]));
    res.send(`<h3>The email has been sent!</h3>
    <h4>please check your inbox</h4>
    <br>
    <p>Didn't get the email yet?:</p>
    <form action="/api/todo/users/resend" method="post">
        <input name="email" type="hidden" value="${req.body.email}">
        <button type="submit">Resend verification Link</button>
    </form>`);
  } catch (e) {
    console.error(e);
    res.status(500).send("something faild please try again after a while");
  }
});

router.post("/resend", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("User not found!");

    const token = user.generateAuthToken();
    const data = {
      from: "todo.app@gmail.com",
      to: req.body.email,
      subject: "Hello",
      html: `
        <h2>Please clike on the link to activate your account</h2>
        <a style="color:green;border-radius:5px" href=${config.get(
          "UrlBase"
        )}:${config.get("Port")}/api/todo/users/verify/${token}>Verify</a>
      `,
    };
    mg.messages().send(data, function (error, body) {
      if (error) console.log("Couldn't send email!", error);
      console.log(body);
    });
    res.send(`<h3>The email has been Resent!</h3>
    <h4>please check your inbox</h4>
    <br>
    <p>Didn't get the email yet?:</p>
    <form action="/api/todo/users/resend" method="post">
        <input name="email" type="hidden" value="${req.body.email}">
        <button type="submit">Resend verification Link</button>
    </form>`);
  } catch (e) {
    console.error(e);
    res.status(500).send("something faild please try again after a while");
  }
});

//verifying the link with the sent token
router.get("/verify/:token", async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, config.get("jwtPrivateKey"));
    const user = await User.findById(decoded._id);
    if (!user)
      return res.status(404).send("User doesn't exist or token is invalid!");

    await User.updateOne({ _id: user._id }, { verified: true });

    return res
      .cookie("token", req.params.token, {
        sameSite: "lax",
        httpOnly: true,
        maxAge: 365 * 24 * 3600000,
      })
      .send("account verified sucessfully");
  } catch (e) {
    return res
      .status(400)
      .send(
        "An error occured User doesn't exist or token is invalid please try again!"
      );
  }
});

router.post("/login", async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send("Invalid email or password");

  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user)
      return res
        .status(400)
        .send("Wrong email or password!\nPlease try agian!");

    if (!user.verified)
      return res
        .status(400)
        .send(
          "User not verified yet please check your email for verification link first!"
        );

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res
        .status(400)
        .send("Wrong email or password!\nPlease try agian!");

    const token = user.generateAuthToken();
    return res
      .cookie("token", token, {
        sameSite: "lax",
        httpOnly: true,
        maxAge: 365 * 24 * 3600000,
      })
      .send(`Hello ${user.name} \nLoged in successfully!`);
  } catch (e) {
    console.error(e);
    res.status(500).send("something faild! please try again after a while.");
  }
});

router.get("/logout", async (req, res) => {
  res.clearCookie("token").send("loged out successfully");
});

module.exports = router;
