const User = require('../../models/userRole/user');
const validationerror = require('../../middleware/validationError');
const sellerVerifyModel = require('../../models/userRole/sellerVerifyModel');


class AdminController {
    async verifySeller(req, res, next) {
        try {
            var user = await User.findOne({ email: req.body.email });
            if (!req.params.userId) {
                if (!user.verifiedByAdmin) {
                    console.log("from admin AdminController");
                    console.log(user);
                    const whoIsUsing = await User.findOne({email: req.body.adminEmail});
                    const seller = await sellerVerifyModel.create({
                        contactNumber: req.body.contactNumber,
                        addressId: req.body.addressId,
                        verifiedBy: whoIsUsing.email
                    });
                    user.verifiedByAdmin = true;
                }

                await user.save();
                res.send("Done");
            }
            else {
                var whoIsUsing = await User.findOne({ userId: req.params.userId });
                if (!user.verifiedByAdmin) {
                    const seller = await sellerVerifyModel.create({
                        contactNumber: req.body.contactNumber,
                        addressId: req.body.addressId,
                        verifiedBy: whoIsUsing.email
                    });
                    user.verifiedByAdmin = true;
                }

                await user.save({ validateBeforeSave: false});
                res.send("Done");
            }
        } catch (error) {
            return next(new validationerror(error.message, 400));
        }

    }
}


const adminController = new AdminController()
module.exports = adminController