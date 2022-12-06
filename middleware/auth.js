const jwt = require('jsonwebtoken')

module.exports = (req, res, next) =>{
    const authHeader = req.get('Authorization')
    console.log("authHeader auth.js", authHeader)
    if(!authHeader){
        req.isAuth = false
        return next()
    }
    const token = req.get('Authorization').split(' ')[1].replaceAll('"','')
    console.log("token ", token)
    let decodedToken
    // console.log("decoded ",decodedToken)
    try{
        decodedToken = jwt.verify(token, 'secret')
        // console.log(decodedToken)
    }
    catch(err){
        console.log("decoded fail")
        req.isAuth = false
        next()
    }
    if(!decodedToken){
        req.isAuth = false
        return next()
    }
    console.log("decodedToken", decodedToken)
    req.userId = decodedToken.userId
    console.log('auth.js userId ', req.userId)
    req.isAuth = true
    next()
}