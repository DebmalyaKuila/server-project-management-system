const User = require("../models/userModel")

//create admin in database
const createAdmin =async ()=>{

    try {
        const hasAdmin = await User.findOne({email : process.env.ADMIN_EMAIL || "admin@admin.com"})
    if(!hasAdmin){
        const admin = new User(
            {
            name: process.env.ADMIN_NAME || "Admin",
            email: process.env.ADMIN_EMAIL || "admin@admin.com",
            password:  process.env.ADMIN_PASSWORD || "admin",
            role:"Admin",
            designation:"owner",
          });
        await admin.save();
        console.log("new admin added");
    }               
    } catch (err) {
        console.log(err);
    }

}

module.exports=createAdmin