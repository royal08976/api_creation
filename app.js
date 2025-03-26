require("dotenv").config()


const express=require("express")
const app=express()
const connectDB=require("./db/connect")

const port= process.env.port||5000
const products_routes=require("./routes/products")

app.get("/",(req,res)=>{
res.send("hi i am live")
})

app.use("/api/products",products_routes)

const start= async ()=>{
   
       await connectDB(process.env.MONGODB_URL)
       app.listen(port,()=>{
           console.log("hi i am live on this port 5000")
       })
        

}
start()
   
