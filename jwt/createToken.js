const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET_KEY

function generateToken(payload){
    const expiresIn = '10h'
    const token = jwt.sign(payload, secretKey, {expiresIn })
    return token
}

module.exports = {generateToken}