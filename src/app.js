require('dotenv').config()

const express=require("express")
const helmet=require("helmet")
const cors=require("cors")
const logger=require("morgan")
const connectDB=require("./Configs/db.js") 
const createAdmin=require("./helpers/createAdmin.js")
const port=process.env.PORT || 8000
const app=express()

//API security
app.use(helmet())
//handle cors error
app.use(cors())

//connecting to database
connectDB()

//creating admin
createAdmin()

//logger
app.use(logger("combined"))
//setting up body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//load routers
const userRouter=require("./Routes/userRouter")
const tokensRouter=require("./Routes/tokensRouter.js")
const projectsRouter=require("./Routes/projectsRouter.js")
const clientsRouter=require("./Routes/clientRouter.js")

//using routers
app.use("/v1/user",userRouter)
app.use("/v1/tokens",tokensRouter)
app.use("/v1/projects",projectsRouter)
app.use("/v1/clients",clientsRouter)


//setting up error handling
const handleError=require("./Utils/errorHandler")

app.use((req,res,next)=>{
    //when no matching route is found , we are throwing a "resource not found error"
   const error=new Error("resources not found")
   error.status=404
   next(error)
})

app.use((error,req,res,next)=>{
    handleError(error,res)
})





app.listen(port ,()=>{
    console.log(`server up and running on  http://localhost:${port}`);
})
