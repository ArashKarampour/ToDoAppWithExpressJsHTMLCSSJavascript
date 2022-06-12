const {Task} = require("../models/task");
const {User} = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req,res) => {
    try{
        const tasks = await Task.find({userId:req.user._id , done:false});
        return res.render("Today",{tasks:tasks});
    }catch(e){
        console.error(e);
        return res.status(500).render("error500");
    }
});

router.get("/today", (req,res) => {
    res.redirect("/api/todo/mypanel/");
});

router.get("/archive", async (req,res) => {
    try{
        const tasks = await Task.find({userId:req.user._id , done:true});
        return res.render("Archive",{tasks:tasks});    
    }catch(e){
        console.error(e);
        return res.status(500).render("error500");
    }
});

router.get("/inbox" , async (req,res) => {
    try{
        const tasks = await Task.find({userId:req.user._id , done:false});
        const userEmail = await User.find({_id:req.user._id }).select("email");

        //console.log(tasks,"\n",userEmail);
        return res.render("Inbox",{tasks:tasks,userEmail:userEmail});
        
    }catch(e){
        console.error(e);
        return res.status(500).render("error500");
    }
});

module.exports = router;