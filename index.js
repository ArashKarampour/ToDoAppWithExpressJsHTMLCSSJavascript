"use strict";

// require("express-async-errors");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/ToDoApp")
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("Couldn't connect to DB :", err));

const cookieParser = require("cookie-parser");
const users = require("./routes/users");
const config = require("config");

if (!config.get("jwtPrivateKey")) console.log("jwtPrivateKey is not set!");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/todo/users", users);

app.get("/", (req, res) => {
  res.send("Hello");
});

// const port = process.env.PORT || 3000;
const port = config.get("Port");
app.listen(port, () => console.log(`listining to port ${port}`));

// module.exports = port;
