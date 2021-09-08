const expressJwt = require('express-jwt');
const User = require('./../models/userRole/user');
const validationerror = require("./validationError")

require('dotenv').config({ path: '.env' });

exports.requireSignin = expressJwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ['HS256'],
  userProperty: 'auth' }), (req, res) => {
    return res.status(403).json({ error: "Not Signed IN" })
  };

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile.userId == req.auth.userId;
  if(!user) {
    return res.status(403).json({
      error: "Access denied!"
    });
  }
  next();
}

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    const user = User.findOne({userId: req.params.Id});
    if (!roles.includes(user.userRole)) {
      (
        new validationerror('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};
