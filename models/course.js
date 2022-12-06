const mongoose = require('mongoose')
const Schema = mongoose.Schema

const courseSchema = new Schema({
    courseID:{
        type: String,
        required: true
    },
    courseTitle: {
        type: String,
        required: true
    },
    courseInstructor: {
        type: String, 
        required: true
    },
    courseContent:{
        type: String,
        required: true
    }
    ,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true
    }
})


module.exports = mongoose.model('Course', courseSchema)