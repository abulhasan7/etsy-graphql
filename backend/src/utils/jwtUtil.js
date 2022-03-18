const jwt = require('jsonwebtoken');

function generateToken(user_id,shop_id,fullname){

    const payload = {
        user_id:user_id,
        fullname:fullname
    }
    if(shop_id){
        payload.shop_id = shop_id
    }
    console.log("payload is ",payload)
    return jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET);
}

module.exports = {generateToken}