const { valdiationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

exports.signup = async (req, res, next) =>{
    const errors = valdiationResult(req)
    if(!errors.isEmpty){
        const error = new Error('Valdiation failed')
        error.statusCode = 422
        error.data = errors.array()
        throw error
    }

    const email = req.body.email
    const name = req.body.name
    const password = req.body.password
    try{
        const hashedPassword = await bcrypt.hash(password,12)
        const user = new User({
            email: email,
            name: name,
            password: hashedPassword
        })
        const result = await user.save()
        res.status(201).json({ message: 'User Created', userId: result._id})
    } catch(err){
        if (!err.statusCode){
            err.statusCode = 500
            next(err)
        }
    }
}

exports.login = async(req, res, next) =>{
    const email = req.body.email
    const password = req.body.password
    let loadedUser
    try{
        const user = await User.findOne({ email: email})
        if(!user){
            const error = new Error('User does not exist')
            error.statusCode = 401
            throw error
        }

        loadedUser = user
        const isEqual = bcrypt.compare(password, user.password)
        if(!isEqual){
            const error = new Error('Wrong Password')
            error.statusCode = 401
            throw error
        }

        const token = jwt.sign(
            {
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            },
            'secret',
            { expiresIn: '1h'}
        )
        res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    } catch(err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    }
}