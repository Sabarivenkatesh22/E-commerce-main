const expressJwt = require('express-jwt');
const User = require('./../models/userRole/user');
const validationerror = require("./validationError")

require('dotenv').config({ path: '.env' });

exports.requireSignin = expressJwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ['HS256'],
  userProperty: 'auth' }), (req, res,next) => {
    return next(new validationerror('Not Signed In', 401));
  };

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile.userId == req.auth.userId;
  if(!user) {
    return next(new validationerror('Access denied', 401));
  }
  next();
}

exports.restrictTo = (...roles) => {
  return async (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    const user = await User.findOne({userId: req.params.userId});
    console.log("from restrictTo");
    console.log(user);
    if (!roles.includes(user.userRole)) {
      
       return next(new validationerror('You do not have permission to perform this action', 403));
      
    }

    next();
  };
};
