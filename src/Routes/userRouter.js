const express = require("express")
const bcrypt=require("bcrypt")
const User = require("../models/userModel")
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper.js")
const userAuthorization = require("../Middlewares/auth.js")
const resetPinModel = require("../models/resetPinModel.js")
const emailProcessor = require("../helpers/email.helper.js")
const {resetPasswordValidation,updatePasswordValidation,createNewUserValidation,loginValidation}=require("../Middlewares/validation.js")
const isAdmin=require("../Middlewares/isAdmin.js")

const router = express.Router()


router.all("/", (req, res, next) => {
    next()
})

//admin creates a new opeartor
router.post('/',createNewUserValidation,userAuthorization,isAdmin, async (req, res) => {
    try {
        const newUser = await new User(req.body)
        await newUser.save();
        res.status(200).send({ message: "new user created", user: newUser })
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            return res.status(400).send({ message: "failed to create user", error })
        }
        res.status(400).send({ message: "failed to create user" })
    }
})
//employee log in 
router.post('/login',loginValidation, async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ message: "Invalid form data" })
    }

    try {
        //1.we find the user by given credentials
        //findByCredentials() is a method defined by me in user model , which is a reusable function 
        const user = await User.findByCredentials(email, password)
        const accessToken = await createAccessJWT(user.email, user._id.toString())
        const refreshToken = await createRefreshJWT(user.email, user._id.toString())

        res.send({ message: `welcome ${user.name}`, user, accessToken, refreshToken })
    } catch (error) {
        console.log(error)
        res.status(400).send()

    }
})

//get my profile
router.get("/me", userAuthorization, async (req, res) => {

    try {
        const userId = req.userId
        const userProfile = await User.findById(userId)
        if (!userProfile) return res.status(404).send({ message: "user not found" })
        res.send({ user: userProfile })
    } catch (error) {
        console.log(error);
        res.send(500).send({ message: "internal server error ,please try again later" })
    }
})

//update my profile
router.patch("/me",userAuthorization, async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate({_id:req.userId},req.body,{
            new:true
        });
        await updatedUser.save()
        res.send(updatedUser)
    } catch (error) {
        console.log(error);
        res.status(500).send({message : "internal server error"})
    }

})

//get all employees
router.get("/", userAuthorization, async (req, res) => {

    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        console.log(error);
        res.send(500).send({ message: "internal server error ,please try again later" })
    }
})

//update employee details (only by admin)
router.patch("/:id",userAuthorization,isAdmin, async (req, res) => {
    try {
    const updates = Object.keys(req.body)
    //specifying allowed update operations
    const allowedUpdateOperations = ["name", "email","phone","role","designation"]
    //determine whether the update operation is valid or not 
    const isValidOperation = updates.every((update) => {
        return allowedUpdateOperations.includes(update)
    })
    //if some invalid update is being performed for some values in database which are not changable
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid update !!" })
    }
    const user = await User.findOne({_id:req.params.id});
    updates.forEach((update) => {
        user[update] = req.body[update]
    })
        await user.save()
        res.send(user)
    } catch (error) {
        console.log(error);
        res.status(500).send({message : "internal server error"})
    }

})

//only admin can delete employee details
router.delete("/:id",userAuthorization,isAdmin, async (req, res) => {
    try {
        const user = await User.findOneAndDelete({_id:req.params.id})
        if (!User) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(500).send({
            reason: "internal server error",
            message: "our services are currently down",
        })
        console.log("Error : ",error)
    }
})

router.post("/reset-password",resetPasswordValidation, async (req, res) => {
    try {
        const { email } = req.body

        const user = await User.findOne({ email: email })

        //if a user really exists,create a reset pin and send in the given email
        if (user && user._id) {
            const data = await resetPinModel.setPasswordResetPin(user.email)
            if (data?.email && data?.pin) {
                const result = await emailProcessor({type:"password-reset",email:data.email,pin:data.pin})
            }
        }
        res.send({ message: "you will get a password reset pin in the registered email shortly..." })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal server error" })
    }
})


router.patch("/reset-password",updatePasswordValidation, async (req, res) => {

    try {
        const { email, pin, newPassword } = req.body
        const result = await resetPinModel.findOne({ email, pin: pin.toString() })
        if (!result) {
            return res.send({ message: "Something wrong happened.Please try again later..." })
        }
        // check whether the reset pin is expired or not 
        const addDate = result.addedAt
        const expiryDate = addDate.setDate(addDate.getDate() + +process.env.PASSWORD_RESETPIN_EXPIRY_DAYS)
        const today = new Date()
        if (today > expiryDate) {
            return res.send({ message: "Invalid pin" })
        }
        //hash the new password
        const newHashedPassword=await bcrypt.hash(newPassword,8)
        //now update the password
        const user = await User.findOneAndUpdate(
            { email}
            ,
            {"password": newHashedPassword}
            ,
            {new: true})
        if (user._id) {
            //send email notification
            await emailProcessor({type:"password-updated",email})
            //when the new password is set, we also need to delete the reset pin from database
            await resetPinModel.deleteMany({email})

            return res.send({ message: "password changed succesfully!" })
        }
        res.send({ message: "unable to change password. Please try again later !" })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal server error" })
    }

})



module.exports = router