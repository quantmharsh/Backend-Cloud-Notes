const mongoose=require('mongoose');
require('dotenv').config();
// const mongoURI="mongodb+srv://viratkohli0737:B4PMsOOoq8vtL3TW@cluster0.erluey0.mongodb.net/";
const mongoURI= process.env.DB_Link;
const connectToMongo= async()=>{
        try{
          await  mongoose.connect(mongoURI);
        
        console.log("connected to MongoDB succesfully");
        }
        catch(error)
        {
          console.log("error connecting to db " ,error);
        }
    
};
module.exports=connectToMongo;