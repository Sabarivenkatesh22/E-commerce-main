const expressJwt = require('express-jwt');
const User = require('./../models/userRole/user');
const validationerror = require("./validationError");
const Product = require('../models/product/product');


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

exports.checkProductId =  (req,res ,next) => {
  // var count =0;
  var product;
  var result = req.body.productId;
  result.forEach( async function(e){
       product = await Product.findOne({ productId: e });
      //  console.log("from loop");
      //  console.log(product.productId);
       if(!product) {
        return next(new validationerror("not a valid productId", 401));
  }
});
next();
}
