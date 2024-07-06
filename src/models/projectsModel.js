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

const Project = model("project",projectSchema)

module.exports=Project