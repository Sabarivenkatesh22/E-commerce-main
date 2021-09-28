const User = require("./../../models/userRole/user");
const sellerVerifyModel = require("./../../models/userRole/sellerVerifyModel");
const validationerror = require("../../middleware/validationError");
const wishListController = require("../user/wishListController");
const cartListController = require("../user/cartListController");
const deliveryPageController = require("../user/deliveryPageController");

const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class RegisterController {

  async registerUser(req, res) {
    try {

     

      const user = await User.create({
        email: req.body.email,
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        contactNumber: req.body.contactNumber,
        password: req.body.password,
        userRole: req.body.userRole,
      });
    //  const  result = await promise.all([
    //     wishListController.createWishList(user.userId,res),
    //     cartListController.createCartList(user.userId,res),
    //     deliveryPageController.createDeliveryPage(user.userId,res),
    //   ]);
      
      // let emailCheck = await User.findOne({
      //   email: email,
      // });
      // let usernameCheck = await User.findOne({
      //   username: username,
      // });
      console.log(user);
     var resultCartList  = await cartListController.makeCartList(user.userId);
     var resultWishList  = await wishListController.makeWishList(user.userId);
     console.log(resultCartList);
     console.log(resultWishList);

    } catch (err) {
      res
        .status(400)
        .json(
          new validationerror(
            err.message,
            400
          )
        );

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
    // this verification link to be sent to user email 
     
    // this.sendVerifyToken(req);
    if (role == "seller") {
      this.verifySeller(req);
    }
    if (role == "admin") {
      this.verifyAdmin(req);
    }


  }


  // token will be sent to all users for verification
  async sendVerifyToken(req) {
    const token = User.createVerificationToken();
    await User.save({ validateBeforeSave: false });
    const checkURL = `${req.protocol}://${req.get(
      "host"
    )}/api/user/verification/${token}`;
    res.send(checkURL);
  }

  //  checking of token to verify the user
  async checkToken(req, res) {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
    });
    if (!user) {
      (new validationerror("Token is invalid or has expired", 400));
    }
    else {
      // making first verification true for every user after checking the token
      user.verified = "true",

        res.send("User verified");
    }
  }

  // the req json should be in the form of: see sellerVerifyModel and 
  // req should contain the userID of the seller
  async verifySeller(req, res) {

    const user = await User.findOne({ userId: req.body.userId });
    if (!user) (new validationerror("User is not found", 400));
    const seller = await sellerVerifyModel.create({
      contactNumber: req.body.contactNumber,
      addressId: req.body.addressId,
    });
    if (seller != null) {
      user.verifiedByAdmin = "true";
      res.send("seller verified");
    }
  }

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
