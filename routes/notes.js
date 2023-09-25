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

//Router 3: put request for updating notes
router.put('/updatenotes/:id' ,fetchUser ,async(req ,res)=>{
  //destructuring our request
 const  {title ,description ,tag}=req.body;
 //checking whether notes exist or not
 const newNote={};
 if(title)newNote.title=title;
 if(description)newNote.description=description;
 if(tag)newNote.tag=tag;
  
 //checking whether  note with this id existed or not
 let note=  await Notes.findById(req.params.id);
 if(!note)
 {
  return res.status(401).send("Requested id not found..");

 }
 //checking whether its same user whose id is their
 if(req.user.id!=note.user.toString())
 {
  return res.status(404).send("Update not approved..");
 }
 //if we reach here that means our user is original whose notes need to be updated
  note=await Notes.findByIdAndUpdate(req.params.id , {$set :newNote} ,{new:true});
  res.send({note});

  

})
module.exports=router;