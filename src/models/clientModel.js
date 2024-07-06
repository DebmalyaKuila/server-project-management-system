const {Schema,model}=require("mongoose")

const clientSchema=new Schema({
    name:{
        type:String,
        maxlength:100,
        required:true
    },
    company:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    paid:{
        type:String,
        required:true
    },
    budget:{
        type:String,
        required:true
    }
},
{
    timestamps:true
})

clientSchema.methods.toJSON = function(){
    //get the mongoose document using this keyword
    const client = this
    //convert the mongoose document to an object by using toObject() method of mongoose
    const clientObject=client.toObject()
    
    delete clientObject.createdAt
    delete clientObject.updatedAt
    delete clientObject.__v

    return clientObject
}

const Client = model("client",clientSchema)

module.exports=Client