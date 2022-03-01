const jwt = require('jsonwebtoken');

function checkAuthenticationHeader(req,res,next) {
    console.log(req.originalUrl);
    if(req.originalUrl !== '/users/register'){
    const authorization = req.headers.authorization;
    console.log(req.headers);
    if(authorization!=null){
        const token = authorization.split(" ")[1];
        // try{
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        console.log("decoded",decoded);
       
        req.email = decoded.email;
        // }catch(error){
        //     console.log(error)
        // }
  
    }else{
        console.log("no authorization header");
        res.sendStatus(401);
    }
}
next();

}
module.exports = {checkAuthenticationHeader}