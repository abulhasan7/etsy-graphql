/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

// Setup work and export for the JWT passport strategy
const opts = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};

passport.use(new JwtStrategy(opts, (jwtPayload, callback) => {
  console.log('jwt payload is ', jwtPayload);
  const userId = jwtPayload.user_id;
  let shopId;
  if (jwtPayload.shop_id) {
    shopId = jwtPayload.shop_id;
  }
  return callback(null, { userId, shopId });
}));

// exports.auth = auth;
exports.checkAuth = passport.authenticate('jwt', { session: false }, (error, user) => {
  console.log('in check auth');
});
