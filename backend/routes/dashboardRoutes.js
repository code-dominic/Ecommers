const express = require("express");
const User = require("../models/User");


const router = express.Router();

router.get("/users" , async (req , res)=>{
    console.log("this route was hit");
    try{
        const user = await User.find({Role : 'users'});
        console.log(user);
        res.status(201).json(user);
    }catch(error){
        res.status(401).json({message : error})
    }
});

router.get("/admin" , async (req , res)=>{
    console.log("this admin route was hit");
    try{
        const user = await User.find({Role : 'admin'});
        console.log(user);
        res.status(201).json(user);
    }catch(error){
        res.status(401).json({message : error})
    }
});


module.exports =  router;