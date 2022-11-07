const jwt =  require('jsonwebtoken')

module.exports = (req, res, next) =>{
    const authHeader = req.get('Authorization')
    // console.log(authHeader)
    console.log("Hello Auth")
    next()
}
