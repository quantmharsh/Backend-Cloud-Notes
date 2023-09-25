var jwt= require('jsonwebtoken');
const fetchUser=(req ,res, next)=>{
  const token = req.header("auth-Token");
  const JWT_SECRET="Harshisgoodboy";
  if(!token)
  {
    res.status(401).send({error:"Please authenticate using valid token"});

  }
  try{

  //we are vertifying whether token is corerect pr not 
  const data= jwt.verify(token ,JWT_SECRET)
  req.user=data.user;
  next();
  }
  catch(error)
  {
    res.status(401).send({error:"Please authenticate using valid token"});
  }
}
module.exports= fetchUser;