const express= require('express');
//for validation we are installing  express validator
const { query, validationResult ,body } = require('express-validator');
//for connecting to our User.js which is connected to our db we are using this
const User= require('../models/User');
const { default: mongoose } = require('mongoose');
const router=express.Router();


//create auser using :POST "api/auth"  ir doesent require auth
 //here  we are using array for putting all the validatora that we require
router.post('/createuser',[
    body('name' ,'enter valid name').isLength({min :3}),
    body('email' ,'enter valid email address').isEmail(),
    body('password' ,'password size should be more then 5').isLength({min:5})
],async (req ,res)=>{
    try{
     console.log(req.body);
     const errors= validationResult(req);
     if(!errors.isEmpty())
     {
        return res.status(400).json({errors:errors.array()});
     }
    //  User.create({
    //     name:req.body.name,
    //     password:req.body.password,
    //     email:req.body.email,
    //  }).then(user=>res.json(user))
    //  .catch(err=>console.log(err))
    //  res.send("hello harsh");
    //  res.send(req.body);
     //passing the req.body in User database and storing it 
     const existingUser= await User.findOne({email:req.body.email});
     if(existingUser)
     {
        return res.status(400).json({error:"user already existed"});
     }
     const user= User(req.body);
      await user.save();
      res.status(201).json({message:"User created succesfully"});
    }//try closed
    catch(error)
    {
        console.log(error);
   return res.status(500).json({error:"internal server error"});
    }
})
module.exports=router
