"use strict";

// require("express-async-errors");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/ToDoApp")
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("Couldn't connect to DB :", err));

const cookieParser = require("cookie-parser");
const users = require("./routes/users");
const tasks = require("./routes/tasks");
const panel = require("./routes/panel");
const auth = require("./middlewares/auth");
const config = require("config");

if (!config.get("jwtPrivateKey")) console.log("jwtPrivateKey is not set!");


app.get("/", (req, res) => {
  //res.send("Hello");
  ///res.sendFile("/home/arash/vscodeProjects/nodejs/ToDo List/public/Home.html");
  res.sendFile("./public/Home.html", { root: __dirname });
});

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use("/api/todo/users", users);
app.use(auth);
app.use("/api/todo/mypanel", panel);
app.use("/api/todo/tasks", tasks);

// const port = process.env.PORT || 3000;
const port = config.get("Port");
app.listen(port, () => console.log(`listining to port ${port}`));

// module.exports = port;
