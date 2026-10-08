const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_CONN;

mongoose.connect(MONGO_URI)
    .then(() =>{
        console.log("Mongodb connected successfully.")
    }).catch((error) => {
        console.log("Mongodb connection error.", error)
    })


    