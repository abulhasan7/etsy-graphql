const jwt = require('jsonwebtoken');

function generateToken(user_id){
    const payload = {
        user_id:user_id,
    }
    return jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET);
}

module.exports = {generateToken}