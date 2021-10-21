const User = require("./../../models/userRole/user");
const sellerVerifyModel = require("./../../models/userRole/sellerVerifyModel");
const validationerror = require("../../middleware/validationError");
const wishListController = require("../user/wishListController");
const cartListController = require("../user/cartListController");
const deliveryPageController = require("../user/deliveryPageController");
const Email = require("../../utils/email");
const Hashing = require("../../utils/hashing");
const emailController = require("../emailController/emailController");

// const { v4: uuidv4 } = require("uuid");
const { uuid } = require("uuidv4");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class RegisterController {

  // async sendToken(req,next) {
  //   try {
  //     console.log("from sendVerifyToken");
  //     const user = await User.findOne({ email: req.body.email });
  //     const token = user.createEmailVerificationToken();
  //     await user.save();
  //     const checkURL = `${req.protocol}://${req.get(
  //       "host"
  //     )}/api/user/verification/${token}`;

  //     // send email to user
  //     new Email(user, checkURL).sendWelcome();

  //     console.log(checkURL);
  //   } catch (error) {
  //     return next(new validationerror(error.message,400));
  //   }
  // }

  //  checking of token to verify the user
  // async checkToken(req, res) {

  //   console.log("from checkToken");
  //   var token = req.params.token.trim();
  //   const hashedToken = Hashing.hash(token,((token.length)));
  //   console.log(hashedToken);
  //   const user = await User.findOne({
  //     token: hashedToken,
  //     // passwordResetExpires: { $gt: Date.now()
  //   //  }
  //   });
  
  //   // let user = await User.findOne({
  //   //   passwordResetToken: hashedToken,
  //   // });
  //   if (!user) {
  //     return next(new validationerror("Token is invalid or has expired", 400));
  //   } else {
  //     // making first verification true for every user after checking the token
  //     (user.verified = "true"),
  //      user.save();
  //     res.send("User verified");
  //   }
  // };

  // important: send only new email in req
  async changeEmail(req, res,next) {
    try {
      let user = User.findOne(req.params.userId);
      user.email = req.body.email;
      user.verified = false;
      emailController.sendVerifyToken(req,next);
      // this.sendToken(req);
      user.save();
    } catch (error) {
      return next(new validationerror(error.message,400));
    }
    
  };

  // async toPrint()
  // {
  //   console.log('toPrint');
  // };

  async registerUser(req, res, next) {
    try {
      //   this.userId = uuid();
      // this.createdAt= moment(Date.now()).unix();
      // this.updatedAt= moment(Date.now()).unix();

      // // Hash the password with cost of 12
      let salt = bcrypt.genSaltSync(10);
      let pass = req.body.password;
      let password = bcrypt.hashSync(pass, salt);

      const user = await User.create({
        email: req.body.email,
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        contactNumber: req.body.contactNumber,
        password: req.body.password,
        userRole: req.body.userRole,
        userId: uuid(),
        createdAt: moment(Date.now()).unix(),
        updatedAt: moment(Date.now()).unix(),
        password,
      });

      console.log(user);
      var resultCartList = await cartListController.makeCartList(user.userId);
      var resultWishList = await wishListController.makeWishList(user.userId);
      var resultDeliveryPage = await deliveryPageController.makeDeliveryPage(
        user.userId
      );
      console.log(resultCartList);
      console.log(resultWishList);
      console.log(resultDeliveryPage);
      emailController.sendVerifyToken(req,next);
      // this.sendToken(req);
      // this.toPrint();
    } catch (err) {
      console.log(err);
      return next(new validationerror(err.message, 400));
    }
    // if (emailCheck != null || usernameCheck != null) {
    //   return res
    //     .status(400)
    //     .json(
    //       new validationerror(
    //         "Invalid or Already Existing Username & Email, Use Different One",
    //         400
    //       )
    //     );
    // } else {
    //   const user = await User.create({
    //     email: req.body.email,
    //     username: req.body.username,
    //     firstname: req.body.firstname,
    //     lastname: req.body.lastname,
    //     contactNumber: req.body.contactNumber,
    //     password: req.body.password,
    //     userRole: req.body.userRole,
    //   });
    // creating wishlist,cartlist and deliveryPage for the user when register
    // await wishListController.createWishList(user.userId);
    // await cartListController.createCartList(user.userId);
    // await deliveryPageController.createDeliveryPage(user.userId);

    const role = req.body.userRole;
    res.status(200).json({ message: "ok" });
  }
    // this verification link to be sent to user email

    // this.sendVerifyToken(req);
    // if (role == "seller") {
    //    this.verifySeller(req);
    // }
    // if (role == "admin") {
    //    this.verifyAdmin(req);
    // }

  // token will be sent to all users for verification
  

  // the req json should be in the form of: see sellerVerifyModel and
  // req should contain the userID of the seller
  // async verifySeller(req, res) {

  //   const user = await User.findOne({ userId: req.body.userId });
  //   if (!user) return next(new validationerror("User is not found", 400));
  //   const seller = await sellerVerifyModel.create({
  //     contactNumber: req.body.contactNumber,
  //     addressId: req.body.addressId,
  //   });
  //   if (seller != null) {
  //     user.verifiedByAdmin = "true";
  //     res.send("seller verified");
  //   }
  // }

  // async sellerRegister(req, res){

  //   let email = req.body.email
  //   let username = req.body.username
  //   let firstname = req.body.firstname
  //   let lastname = req.body.lastname
  //   let contactNumber = req.body.contactNumber
  //   let userId = uuidv4()
  //   let salt = await bcrypt.genSaltSync(10)
  //   let password = await req.body.password

  //   let emailCheck = await User.findOne({
  //     email: email
  //   })
  //   let usernameCheck = await User.findOne({
  //     username: username
  //   })

  //   if(emailCheck != null || usernameCheck != null ){
  //     return res.status(400).json(new validationerror("Invalid or Already Existing Username & Email, Use Different One", 400));
  //   }
  //   else {
  //     let user = new User({
  //       username: username,
  //       email: email,
  //       firstname: firstname,
  //       lastname: lastname,
  //       role: 2,
  //       contactNumber: contactNumber,
  //       userId: userId,
  //       password: await bcrypt.hashSync(password, salt),
  //       createdAt: moment(Date.now()).unix(),
  //       updatedAt: moment(Date.now()).unix()
  //     })

  //     await user.save()
  //     res.status(200).json({message:"ok"})
  //   }
  // }

  // async adminRegister(req, res){

  //   let email = req.body.email
  //   let username = req.body.username
  //   let firstname = req.body.firstname
  //   let lastname = req.body.lastname
  //   let contactNumber = req.body.contactNumber
  //   let userId = uuidv4()
  //   let salt = await bcrypt.genSaltSync(10)
  //   let password = await req.body.password

  //   let emailCheck = await User.findOne({
  //     email: email
  //   })
  //   let usernameCheck = await User.findOne({
  //     username: username
  //   })

  //   if(emailCheck != null || usernameCheck != null ){
  //     return res.status(400).json(new validationerror("Invalid or Already Existing Username & Email, Use Different One", 400));
  //   }
  //   else {
  //     let user = new User({
  //       username: username,
  //       email: email,
  //       firstname: firstname,
  //       lastname: lastname,
  //       role: 133787,
  //       contactNumber: contactNumber,
  //       userId: userId,
  //       password: await bcrypt.hashSync(password, salt),
  //       createdAt: moment(Date.now()).unix(),
  //       updatedAt: moment(Date.now()).unix()
  //     })

  //     await user.save()
  //     res.status(200).json({message:"ok"})
  //   }
  // }
}

const registerController = new RegisterController();
module.exports = registerController;
