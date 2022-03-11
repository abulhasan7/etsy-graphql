const jwt = require("jsonwebtoken");

function checkAuthenticationHeader(req, res, next) {
  let isError = true;
  if (
    !(req.originalUrl === "/users/register" ||
    req.originalUrl === "/users/login")
  ) {
    const token = req.headers.authorization;
    console.log(req.headers), token;
    if (token != null) {
      try {
        console.log("token is ", token);
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        isError = false;
        console.log("decoded", decoded);
        req.user_id = decoded.user_id;
      } catch (error) {
        console.log(error);
      }
    } else {
      console.error("no authorization header");
    }
    if (isError) {
        throw new Error("Invalid Token, Please login again")
    //   res.status(401).json({ error: "Invalid Token, Please login again" });
    }
  }
  next();
}
module.exports = { checkAuthenticationHeader };
