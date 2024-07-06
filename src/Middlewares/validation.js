const Joi = require('joi')

const email=Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
const pin=Joi.number().min(100000).max(999999).required()
const contactNumber=Joi.number().required()
const password=Joi.string().min(3).max(50).required()


const shortStr=Joi.string().max(60)
const longStr=Joi.string().max(500).allow('')

//reset password validation

const resetPasswordValidation= (req,res,next)=>{
    const schema=Joi.object({email})
    const value=schema.validate(req.body)
    if(value.error){
        return res.send({error:value.error.message})
    }
    next()
}

const updatePasswordValidation= (req,res,next)=>{
    const schema=Joi.object({email ,pin ,newPassword:password})
    const value=schema.validate(req.body)
    if(value.error){
        return res.send({error:value.error.message})
    }
    next()
}

//user validations 

const createNewUserValidation= (req,res,next)=>{
    const schema=Joi.object({
        name:shortStr.min(2).required(),
        role:shortStr.min(2),
        designation:shortStr.min(2),
        phone:contactNumber,
        email:email.required(),
        password
    })
    const value=schema.validate(req.body)
    if(value.error){
        return res.send({error:value.error.message})
    }
    next()
}

const loginValidation=(req,res,next)=>{
    const schema=Joi.object({
        email:email.required(),
        password
    })
    const value=schema.validate(req.body)
    if(value.error){
        return res.send({error:value.error.message})
    }
    next()
}

// project validation
const createNewProjectValidation= (req,res,next)=>{
    const schema=Joi.object({
        title:shortStr.min(2).required(),
       deadline:shortStr.min(2),
        income:Joi.number()
    })
    const value=schema.validate(req.body)
    if(value.error){
        return res.send({error:value.error.message})
    }
    next()
}

const projectValidation= (req,res,next)=>{
    const schema=Joi.object({
        _id:longStr.min(8),
        title:shortStr.min(2),
        deadline:shortStr.min(2),
        income:Joi.number()
    })
    const value=schema.validate(req.body)
    if(value.error){
        return res.send({error:value.error.message})
    }
    next()
}

//client validation
const createClientValidation= (req,res,next)=>{
    const schema=Joi.object({
        name:shortStr.min(2),
        company:shortStr.min(2),
        email:email.required(),
        phone:contactNumber.required(),
        paid:Joi.number(),
        budget:Joi.number()
    })
    const value=schema.validate(req.body)
    if(value.error){
        return res.send({error:value.error.message})
    }
    next()
}


const clientValidation= (req,res,next)=>{
    const schema=Joi.object({
        _id:longStr.min(8),
        name:shortStr.min(2),
        company:shortStr.min(2),
        email:email,
        phone:contactNumber,
        paid:Joi.number(),
        budget:Joi.number()
    })
    const value=schema.validate(req.body)
    if(value.error){
        return res.send({error:value.error.message})
    }
    next()
}


module.exports={
    resetPasswordValidation,
    updatePasswordValidation,
    createNewUserValidation,
    loginValidation,
    createNewProjectValidation,
    projectValidation,
    createClientValidation,
    clientValidation
}