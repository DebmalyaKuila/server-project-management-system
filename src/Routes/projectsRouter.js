const express = require("express")
const Project = require("../models/projectsModel.js")
const userAuthorization = require("../Middlewares/auth.js")
const {createNewProjectValidation,projectValidation}=require("../Middlewares/validation.js")

const router = express.Router()

router.all("/", (req, res, next) => {
    next()
})

//creating new project
router.post('/',createNewProjectValidation,userAuthorization, async (req, res) => {
    try {
        const newProject = await new Project(req.body)
        await newProject.save()
        res.status(200).send({ message: "new project created", project: newProject })
    } catch (error) {
        if (process.env.NODE_ENV === "development") {
            return res.status(400).send({ message: "failed to create project", error })
        }
        res.status(400).send({ message: "failed to create project" })
    }
})

//get all projects
router.get("/", userAuthorization, async (req, res) => {

    try {
        const projects = await Project.find({})
        res.send({ projects })
    } catch (error) {
        console.log(error);
        res.send(500).send({ message: "internal server error ,please try again later" })
    }
})

//update project details
router.put("/",projectValidation,userAuthorization, async (req, res) => {
    try {
        const updatedProject = await Project.findOneAndUpdate({_id:req.body._id},req.body,{
            new:true
        });
        await updatedProject.save()
        res.send(updatedProject)
    } catch (error) {
        res.status(400).send(error)
    }

})

//delete a task created by a specific user 
router.delete("/:id",userAuthorization, async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({_id:req.params.id})
        if (!project) {
            return res.status(404).send()
        }
        res.send(project)
    } catch (error) {
        res.status(500).send({
            reason: "internal server error",
            message: "our services are currently down",
        })
        console.log("Error : ",error)
    }
})


module.exports = router