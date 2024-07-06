const {Schema,model}=require("mongoose")

const projectSchema=new Schema({
    title:{
        type:String,
        maxlength:100,
        required:true
    },
    deadline:{
        type:String,
        required:true
    },
    income:{
        type:Number,
        default:null
    }
},
{
    timestamps:true
})

projectSchema.methods.toJSON = function(){
    //get the mongoose document using this keyword
    const project = this
    //convert the mongoose document to an object by using toObject() method of mongoose
    const projectObject=project.toObject()

    delete projectObject.createdAt
    delete projectObject.updatedAt
    delete projectObject.__v

    return projectObject
}

const Project = model("project",projectSchema)

module.exports=Project