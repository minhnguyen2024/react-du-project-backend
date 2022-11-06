const mongoose = require('mongoose')
const express = require('express')
const app = express()

const MONGO_URI = 'mongodb+srv://minhnguyen_2024:Nerfrecon098.@cluster0.yz24zit.mongodb.net/courses?retryWrites=true'

mongoose.connect(MONGO_URI)
    .then(result =>{
        app.listen(8000)
        console.log("8000 connected")
    })
    .catch(err => console.log(err))