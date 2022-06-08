const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", (req,res) => {
    
    res.render("Today");
});

router.get("/today", (req,res) => {
    res.render("Today");
});


module.exports = router;