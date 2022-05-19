"use strict";

const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/ToDoApp")
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("Couldn't connect to DB :", err));

const users = require("./routes/users");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/todo/users", users);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listining to port ${port}`));
