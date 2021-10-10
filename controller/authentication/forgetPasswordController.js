const User = require("./../../models/userRole/user");
const validationerror = require("../../middleware/validationError");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const Hashing = require("./../../utils/hashing");
const { type } = require("os");

class ForgetPasswordController{

    async forgetPassword (req, res,next) {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new validationerror('There is no user with email address.', 404));
    }
    // 2) Generate the random reset token
    const resetToken = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    // user.save() won't work as it make some validation error.
    // await user.save();
    console.log(user);
    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/resetPassword/${resetToken}`;
    res.send(resetURL);
};

// in the reset password token api we have to use token parameter 
 async resetPassword  (req, res,next)  {
    // 1) Get user based on the token
    // const hashedToken = crypto
    //   .createHash('sha256')
    //   .update(req.params.token)
    //   .digest('hex');
  // const token = (req.params.token).toString();
  // console.log(token);
  // console.log(token.length);
  // const s1 = "sabarivenkatesh";
  // if(s1.localeCompare(token)) console.log("same");
  // const hashedToken = Hashing.hash(s1,((s1.length)));
    // console.log(hashedToken);
    console.log("from resetPassword");
    var token = req.params.token.trim();
    const hashedToken = Hashing.hash(token,((token.length)));
    console.log(hashedToken);
    const user = await User.findOne({
      token: hashedToken,
      // passwordResetExpires: { $gt: Date.now()
    //  }
    });
  
    console.log(req.body.password);
    console.log(user);
    console.log("from reset password");
    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
    //   return next(new validationerror('Token is invalid or has expired', 400));
    return next(new validationerror("Process Failed, Check email and password", 400));
    }
    
    let salt = bcrypt.genSaltSync(10)
    let pass = req.body.password;
    let password = bcrypt.hashSync(pass, salt);
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
  
    // 3) Update changedPasswordAt property for the user
    // we have pre middleware in user model to do this...
    // 4) Log the user in, send JWT
    res.send("done");
  };

}


const forgetPasswordController = new ForgetPasswordController();
module.exports = forgetPasswordController;


