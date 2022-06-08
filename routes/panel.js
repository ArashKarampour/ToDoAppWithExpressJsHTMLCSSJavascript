const {Task} = require("../models/task");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req,res) => {
    const tasks = await Task.find({userId:req.user._id});
    res.render("Today",{tasks:tasks});
});

router.get("/today", (req,res) => {
    res.redirect("/api/todo/mypanel/");
});


module.exports = router;