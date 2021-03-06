const jwt = require('jsonwebtoken');

function generateToken(userId, shopId) {
  const payload = {
    user_id: userId,
  };
  if (shopId) {
    payload.shop_id = shopId;
  }
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
}

module.exports = { generateToken };
