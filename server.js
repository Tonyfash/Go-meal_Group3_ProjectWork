require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 1234;
const db = process.env.MONGO_DB

const app = express();

app.use(express.json());


mongoose.connect(db).then(()=>{
    console.log(`Connected to the database successfully`);
    app.listen(PORT, ()=>{
    console.log(`Server is running on the PORT: ${PORT}`);  
})
}).catch((error)=> {
    console.log("Error connecting to the datbase:", error.message);
    
})

