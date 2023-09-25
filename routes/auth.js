const express= require('express');
//for validation we are installing  express validator
const { query, validationResult ,body } = require('express-validator');
//for connecting to our User.js which is connected to our db we are using this
const User= require('../models/User');
const { default: mongoose } = require('mongoose');
const router=express.Router();
const bcrypt= require('bcryptjs');
//using jsonwebtoken for authenticating user using token
var jwt =require('jsonwebtoken');
const JWT_SECRET="Harshisgoodboy";
var fetchUser=require('../middleware/fetchUser');


// Route : 1 create user using :POST "api/auth"  ir doesent require auth
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
    
     //passing the req.body in User database and storing it 
     const existingUser= await User.findOne({email:req.body.email});
     if(existingUser)
     {
        return res.status(400).json({error:"user already existed"});
     }
    //  const user= User(req.body);
    //   await user.save();
    //hashing our password using bcryptjs 
    const salt = await bcrypt.genSalt(10);
    const secpass= await bcrypt.hash(req.body.password ,salt);//adding salt (some extra charact) in password 
    user =await User.create({
            name:req.body.name,
            password:secpass,
            email:req.body.email,
         })
        //making authtoken which will be used to check whether right person is accessing our system or not
        //we are signing authtoken with user id(from db) and sJWT_Secret which we have created 
        //JWT_sECRET  is a string which is used for signing
         const data={
            user:{
                id:user.id 
            }
         }
         const authToken= jwt.sign(data ,JWT_SECRET);

        //  res.json(user)
        res.json({authToken});
      res.status(201).json({message:"User created succesfully"});
    }//try closed
    catch(error)
    {
        console.log(error);
   return res.status(500).json({error:"internal server error"});
    }
})

// Route 2: creating route for authenticating existing user
router.post('/login',[
    
    body('email' ,'enter valid email address').isEmail(),
    body('password' ,'password cannot be blank').exists()
    
],async (req ,res)=>{
  
        const errors= validationResult(req);
        if(!errors.isEmpty())
        {
           return res.status(400).json({errors:errors.array()});
        }
     const {email ,password} =req.body;
    try{
        //checking whether user is present in our db or  not
    const user=await User.findOne({email:req.body.email});
    
    if(!user)
    {
        return res.status(400).json({error:"please check your login credential again"});
    }
     //if he is present then we will check its password
      const passwordCompare=  await bcrypt.compare(password ,user.password);
      if(!passwordCompare)
      {
        return  res.status(400).json({ error: "please check your login credentials again"})
      }
      //now creating token same steps
      const data={
        user:{
            id:user.id
        }
      }
      const authToken = jwt.sign(data , JWT_SECRET);
      res.json({authToken});
     
      
    }
    catch(error){
        console.log(error);
         return res.status(500).json({error:"internal server error while authenticating user"});

    }

})

  //Route 3: Fetching user data using authtoken when user gets logged in into system succesfully
  //fetchUser is a middleware here which is used to fetch info. after this only async req ,res will work
  //we are using  user id to fetch data
  router.post('/getuser' ,fetchUser ,async (req ,res)=>{
       
    try{
     const userid=req.user.id;
     //here we are fetching all data leaving password
     const user= await User.findById(userid).select("-password");
     res.send(user);
    }
    catch(error)
    {
        return res.status(500).json({ error:"internal  server error while fetching user data.."})
    }
  }) 

module.exports=router

