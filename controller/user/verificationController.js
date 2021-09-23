const User = require("../../models/userRole/user");
const validationerror = require("../../middleware/validationError");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const Hashing = require("../../utils/hashing");
const { type } = require("os");
const Email = require("../../utils/email");

class VerificationController {
  async createUserVerifyToken(req, res) {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(
        new validationerror("There is no user with email address.", 404)
      );
    }
    // 2) Generate the random reset token
    const resetToken = await user.createEmailVerificationToken();
    await user.save({ validateBeforeSave: false });
    // user.save() won't work as it make some validation error.
    // await user.save();
    console.log(user);
    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/resetPassword/${resetToken}`;
    res.send(resetURL);
    console.log(resetURL);
    // new Email(user, resetURL).sendWelcome();
  }

  // in the reset password token api we have to use token parameter
  async verifyUser(req, res) {
    var token = req.params.token.trim();
    const hashedToken = Hashing.hash(token, token.length);
    const user = await User.findOne({
      confirmEmailHashedToken: hashedToken,
      //   passwordResetExpires: { $gt: Date.now()
      //  }
    });

    // console.log(req.body.password);
    console.log(user);
    console.log("from verify token");
    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      //   return next(new validationerror('Token is invalid or has expired', 400));
      res
        .status(400)
        .json(
          new validationerror("Process Failed, Check email and password", 400)
        );
    }
    user.verified = true;
    await user.save({ validateBeforeSave: false });

    // 3) Update changedPasswordAt property for the user
    // we have pre middleware in user model to do this...
    // 4) Log the user in, send JWT
    res.send("done");
  }

  //  FOR SELLER

  //   async createSellerVerifyToken (req, res) {
  //     // 1) Get user based on POSTed email
  //     const user = await User.findOne({ email: req.body.email });
  //     if (!user) {
  //       return next(new validationerror('There is no user with email address.', 404));
  //     }
  //     // 2) Generate the random reset token
  //     const resetToken = await user.createSellerVerificationToken();
  //     await user.save({ validateBeforeSave: false });
  //     // user.save() won't work as it make some validation error.
  //     // await user.save();
  //     console.log(user);
  //     // 3) Send it to user's email
  //     const resetURL = `${req.protocol}://${req.get(
  //       'host'
  //     )}/api/resetPassword/${resetToken}`;
  //     res.send(resetURL);
  //     new Email(user, resetURL).sendsellerVerification();
  // };

  // // in the reset password token api we have to use token parameter
  //  async verifySeller  (req, res)  {

  //     var token = req.params.token.trim();
  //     const hashedToken = Hashing.hash(token,((token.length)));
  //     const user = await User.findOne({
  //       verifySellerHashedToken: hashedToken,
  //     //   passwordResetExpires: { $gt: Date.now()
  //     //  }
  //     });

  //     // console.log(req.body.password);
  //     console.log(user);
  //     console.log("from verify token");
  //     // 2) If token has not expired, and there is user, set the new password
  //     if (!user) {
  //     //   return next(new validationerror('Token is invalid or has expired', 400));
  //     res.status(400).json(new validationerror("Process Failed, Check email and password", 400));
  //     }
  //     user.verified = true;
  //     await user.save({ validateBeforeSave: true });

  //     // 3) Update changedPasswordAt property for the user
  //     // we have pre middleware in user model to do this...
  //     // 4) Log the user in, send JWT
  //     res.send("done");
  //   };
}

const verificationController = new VerificationController();
module.exports = verificationController;
