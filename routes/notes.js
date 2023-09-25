const express= require('express');
const router=express.Router();
const Notes= require('../models/Notes');

var fetchUser =require('../middleware/fetchUser');
const { query, validationResult ,body } = require('express-validator');

//Route 1: route for fetching all notes to particular user
//using middleware fetchUser  which will provide userid with help of jsonwebtoken 
router.get('/fetchallnotes',fetchUser,async (req ,res)=>{
    const notes=   await Notes.find({user:req.user.id});
    res.json(notes);
})

//Route2: route for adding notes 
router.post('/addnotes' ,fetchUser,[
  body('title','enter valid title').isLength({min:3}),
  body('description','enter description of minimum 5 words').isLength({min:5})
], async(req ,res)=>{
    const {title ,description ,tag}=req.body;

    try{
      const errors= validationResult(req);
      if(!errors.isEmpty())
      {
        return res.status(400).json({errors:errors.array()});
      }
      const note= new Notes({
        title ,description ,tag ,user:req.user.id
      })
      const savedNote=await note.save();
      res.json(savedNote);
    }
    catch(error)
    {
        return res.status(501).json({error:"internal server error while adding notes"});
    }

})
module.exports=router;