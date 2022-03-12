const jwt = require('jsonwebtoken');

function generateToken(user_id,shop_id){

    const payload = {
        user_id:user_id,
    }
    if(shop_id){
        payload.shop_id = shop_id
    }
    return jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET);
}

module.exports = {generateToken}