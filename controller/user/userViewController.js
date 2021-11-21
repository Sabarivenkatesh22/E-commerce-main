const User = require("./../../models/userRole/user");
const Products = require("./../../models/product/product");
const validationerror = require("./../../middleware/validationError");

const moment = require("moment")

class UserViewController {

  async userDetails(req, res,next){
      var userId = req.params.userId;

      if(userId == req.auth.userId){
          let user = await User.findOne({ userId: userId});

          if (user == null) {
             return next(new validationerror("Process Failed, User not found", 400));
          }

          if (user.userRole == "buyer") {
              return res.status(200).json({ message:"ok",
                                            userId:user.userId,
                                            email:user.email,
                                            firstname:user.firstname,
                                            lastname:user.lastname,
                                            role:user.userRole,
                                            addressName:user.addressName,
                                            contactNumber:user.contactNumber,
                                            verified:user.verified});
          }
          else if (user.userRole == "seller") {
              return res.status(200).json({ message:"ok",
                                            userId:user.userId,
                                            email:user.email,
                                            firstname:user.firstname,
                                            lastname:user.lastname,
                                            role:user.userRole,
                                            addressName:user.addressName,
                                            contactNumber:user.contactNumber,
                                            verified:user.verified,
                                            adminVerification:user.verifiedByAdmin});
          }
          else if (user.userRole == "admin") {
              return res.status(200).json({ message:"ok",
                                            userId:user.userId,
                                            email:user.email,
                                            firstname:user.firstname,
                                            lastname:user.lastname,
                                            role:user.userRole,
                                            addressName:user.addressName,
                                            contactNumber:user.contactNumber,
                                            verified:user.verified,
                                            manualVerification:user.manualVerification});
          }
          else {
              return next(new validationerror("Process Failed, Undefined Role", 400));
          }

      } else {
         return next(new validationerror("Process Failed, Unauthorized", 401));
      }
  }

//   async allProducts(req, res) {
//       try{
//     const product = await Products.find();
//     res.status(200).json({
//         status:"success",
//         results:product.length,
//         product

//     });
// } catch (err) {
//    return next(new validationerror("Process Failed, Unauthorized", 401));
// }
//   }

async getAllUsers(req, res,next) {
    try {
        const allUsers = await User.find();
    res.status(200).json({
        status:"success",
        results: allUsers.length,
        allUsers
    });
    } catch (error) {
       return next(new validationerror(error.message, 401));
    }
    
}

}

const userViewController = new UserViewController()
module.exports = userViewController
