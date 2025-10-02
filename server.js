require('dotenv').config();
const cors = require("cors");

const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 1234;
const db = process.env.MONGO_DB;
const userRouter = require("./router/user");
const paymentRouter = require("./router/payment")
const productRouter = require("./router/product")
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/v1', userRouter);
app.use('/api/v1', paymentRouter);
app.use('/api/v1', productRouter);


app.get("/", (req, res)=>{
    res.send("Welcome to the Go-meal App!")
})

app.use((error, req, res, next)=>{
    if(error){
        return res.status(500).json({
            message: error.message
        })
    }
    next()
})

mongoose.connect(db).then(()=>{
    console.log(`Connected to the database successfully`);
    app.listen(PORT, ()=>{
    console.log(`Server is running on the PORT: ${PORT}`);  
})
}).catch((error)=> {
    console.log("Error connecting to the datbase:", error.message);
    
})

