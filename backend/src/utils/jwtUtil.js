const jwt = require('jsonwebtoken');

function generateToken(email){
    const payload = {
        email:email
    }
    return jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET);
}

module.exports = {generateToken}