const express = require("express")
const Client = require("../models/clientModel.js")
const userAuthorization = require("../Middlewares/auth.js")
const {clientValidation}=require("../Middlewares/validation.js")
const isAdmin=require("../Middlewares/isAdmin.js")

const router = express.Router()

router.all("/", (req, res, next) => {
    next()
})

//only admin can add new client 
router.post('/',clientValidation,userAuthorization,isAdmin, async (req, res) => {
    try {
        const newClient = await new Client(req.body)
        await newClient.save()
        res.status(200).send({ message: "new client added", client: newClient })
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            return res.status(400).send({ message: "failed to add client", error })
        }
        res.status(400).send({ message: "failed to add client" })
    }
})

//get all client
router.get("/", userAuthorization, async (req, res) => {

    try {
        const clients = await Client.find({})
        res.send({ clients })
    } catch (error) {
        console.log(error);
        res.send(500).send({ message: "internal server error ,please try again later" })
    }
})

//update client details
router.put("/",clientValidation,userAuthorization, async (req, res) => {
    try {
        const updatedClient = await Client.findOneAndUpdate({_id:req.body._id},req.body,{
            new:true
        });
        await updatedClient.save()
        res.send(updatedClient)
    } catch (error) {
        res.status(400).send(error)
    }

})

//only admin can delete client details
router.delete("/:id",userAuthorization,isAdmin, async (req, res) => {
    try {
        const client = await Client.findOneAndDelete({_id:req.params.id})
        if (!client) {
            return res.status(404).send()
        }
        res.send(client)
    } catch (error) {
        res.status(500).send({
            reason: "internal server error",
            message: "our services are currently down",
        })
        console.log("Error : ",error)
    }
})


module.exports = router