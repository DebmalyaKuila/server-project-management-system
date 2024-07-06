const User =require("../models/userModel")

const isAdmin = async (req, res , next)=>{

   const user= await User.findById(req.userId)
   if(!user || user.role !="Admin"){
    return  res.status(403).send({message:"Forbidden action..."})
   }
   next()
   
}

module.exports=isAdmin