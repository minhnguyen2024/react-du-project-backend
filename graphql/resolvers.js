const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const Course = require('../models/course')

module.exports = {
    createUser: async function({ userInput }, req){
        const errors = []

        //check vaild email
        if(!validator.isEmail(userInput.email)){
            errors.push({ message: 'Email is invalid'})
        }
        if(validator.isEmpty(userInput.password)){
            errors.push({ message: "Password is too short"})
        }

        if (errors.length > 0){
            const error = new Error("Invalid Input")
            error.data = errors
            error.code = 422
            throw error
        }

        const existingUser = await User.findOne({ email: userInput.email})
        if (existingUser){
            const error = new Error("User already exists")
            throw error
        }
        const hashedPw = await bcrypt.hash(userInput.password, 12)
        const user = new User({
            email: userInput.email,
            name: userInput.name,
            password: hashedPw
        })
        const createdUser = await user.save()
        return { ...createdUser._doc, _id: createdUser._id.toString()}
    },
    login: async function({ email, password}, req){
        console.log("Logging in1...")
        console.log("req.isAuth login",req.isAuth)
        console.log("userId login", req.userId)
        const user = await User.findOne({ email: email})
        if(!user){
            const error = new Error('User not found')
            error.code = 401
            throw error
        }
        const isEqual = await bcrypt.compare(password, user.password)
        if(!isEqual){
            const error = new Error('Password is incorrect')
            error.code = 401
            throw error
        }
        console.log("Correct password")
        
        //return token along with user info
        const token = jwt.sign({
            userId: user._id.toString(),
            email: user.email
        },
            "secret",
            { expiresIn: "1h"}
        )
        console.log("login resolver token", token)
        return { 
            token: token, 
            userId: user._id.toString() 
        }
    },
    createCourse: async function({ courseInput }, req){
        // if(!req.isAuth){
        //     const error = new Error('Not authenticated')
        //     error.code = 401
        //     throw error
        // }
        const errors = []
        // if (validator.isLength(courseInput.courseID, {max: 6})){
        //     errors.push({ message: "Invalid course ID"})
        // }

        // if(validator.isEmpty(courseInput.courseInstructor)){
        //     errors.push({ message: "Please Add Instructor Name"})
        // }

        // if(validator.isEmpty(courseInput.courseContent)){
        //     errors.push({ message: "Please Add Course Content"})
        // }

        // if (errors.length > 0) {
        //     const error = new Error('Invalid input.');
        //     error.data = errors;
        //     error.code = 422;
        //     throw error;
        // }
        console.log("createdBy ",req.userId)
        const user = await User.findById(req.userId);
        // const dummyUser = await User.findById('636a7a4f001931d3ce1f5b27');
        // console.log(dummyUser)
        if (!user) {
            const error = new Error('Invalid user.');
            error.code = 401;
            throw error;
        }
        
        const course = new Course({
            courseID: courseInput.courseID,
            courseTitle: courseInput.courseTitle,
            courseInstructor: courseInput.courseInstructor,
            courseContent: courseInput.courseContent,
            createdBy: user
        })
        const createdCourse = await course.save()
        user.courses.push(createdCourse)
        await user.save()
        return {
            ...createdCourse._doc,
            _id: createdCourse._id.toString()
        }
    },
    courses: async function(req){
        // if(!req.isAuth){
        //     const error = new Error('Not authenticated!!!!')
        //     error.code = 401
        //     throw error
        // }
        const totalCourses = await Course.find().countDocuments()
        const courses = await Course.find()
        console.log('------------------')
        console.log('courses')
        console.log(courses)
        console.log('------------------')
        return {
            courses: courses.map(course =>{
                return {
                    ...course._doc,
                    _id: course._id.toString()
                }
            }),
            totalCourses: totalCourses
        }
    },
    course: async function({ id }, req){
        // if(!req.isAuth){
        //     const error = new Error('Not authenticated')
        //     error.code = 401
        //     throw error
        // }

        const course = await Course.findById(id).populate('createdBy')
        if(!course){
            const error = new Error("Course not found")
            error.code = 404
            throw error
        }
        return {
            ...course._doc,
            _id: course._id.toString()
        }
    },
    myCourses: async function({id}, req){
        console.log({id})
        const courses = await Course.find()
        const myCourses = courses.filter(course => course.createdBy.toString() === id)
    //    console.log(courses)
    console.log('myCourses')
       console.log(myCourses)
       return{
        courses: myCourses.map(course =>{
            return {
                ...course._doc,
                _id: course._id.toString()
            }
        }),
        totalCourses: 0
       }

    },
    user: async function({id}, req){
        console.log(id)
        const user = await User.findById(id)
        console.log(user)
        return { ...user._doc, _id: user._id.toString() }
    }
}