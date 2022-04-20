const jwt = require('jsonwebtoken');

function checkAuthenticationHeader(req, res, next) {
  let isError = true;
  if (
    !(req.originalUrl === '/users/register'
    || req.originalUrl === '/users/login')
  ) {
    const token = req.headers.authorization;
    if (token != null) {
      try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        isError = false;
        console.log('decoded', decoded.user_id);
        req.user_id = decoded.user_id;
        if (decoded.shop_id) {
          req.shop_id = decoded.shop_id;
        }
      } catch (error) {
        console.error('ERROR while verifying token', error);
      }
    } else {
      console.error('no authorization header');
    }
    if (isError) {
      throw new Error('Invalid Token, Please login again');
    //   res.status(401).json({ error: "Invalid Token, Please login again" });
    }
  }
  next();
}
module.exports = { checkAuthenticationHeader };
