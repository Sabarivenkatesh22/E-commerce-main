const User = require("./../../models/userRole/user")
const validationerror = require("../../middleware/validationError");
const cartListController = require("../user/cartListController");
const Email = require("../../utils/email");

const { v4: uuidv4 } = require('uuid')
const moment = require("moment")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class LoginController {

  async userLogin(req, res){

      let email = req.body.email;
      let password = req.body.password;
      let user = await User.findOne({ email: email });
      if (!user) {
          res.status(400).json(new validationerror("Process Failed, Check email and password", 400));
      } else {
          let userId = user.userId;
          if (bcrypt.compareSync(password, user.password)) {
              //let jwt = authMiddleware.createJWT(user);
              var payload = {
                  userId: user.userId,
                  role: user.userRole,
                  iat: moment().unix(),
                  exp: moment(Date.now()).add(14, "days").unix()
              };
            //    new Email(user, resetURL).sendWelcome();
            // new Email(user).sendWelcome();

              var tokesecret = process.env.TOKEN_SECRET;

              var token = jwt.sign(payload, tokesecret);
              if (user.userRole == "buyer") {
                  return res.status(200).json({ message:"ok", token:token, firstname:user.firstname, lastname:user.lastname, userId:user.userId, email:user.email, role:user.rolee, verified:user.verified});
              }
              else if (user.userRole == "seller") {
                  return res.status(200).json({ message:"ok", token:token, firstname:user.firstname, lastname:user.lastname, userId:user.userId, email:user.email, role:user.rolee, verified:user.verified, adminVerification:user.verifiedByAdmin});
              }
              else if (user.userRole == "admin") {
                  return res.status(200).json({ message:"ok", token:token, firstname:user.firstname, lastname:user.lastname, userId:user.userId, email:user.email, role:user.rolee, verified:user.verified, manualVerification:user.manualVerification});
              }
              else {
                  return res.status(400).json(new validationerror("Process Failed, Undefined Role", 400));
              }

          } else {
              res.status(400).json(new validationerror("Process Failed, Check email and password", 400));
          }

          
    
    // cartListController.createCartList(user.userId,res);
      }
  }

}

const loginController = new LoginController();
module.exports = loginController;
