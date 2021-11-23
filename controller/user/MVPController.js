const User = require("../../models/userRole/user");
const validationerror = require("../../middleware/validationError");
const Cart = require("../../models/userFeaturesModel/cartModel");
const Product = require("../../models/product/product");

class MVPController {
    async addMVP(req, res, next) {
        try {
            let user = await User.findOne({ userId: req.params.userId });
            let checkData = req.body.productCategory;
            if (!user.MostVisitedProduct.includes(checkData) && checkData != " ") {
                user.MostVisitedProduct.unshift(checkData);
            }
            if(user.MostVisitedProduct.includes(checkData) && checkData != ""){
                let dataIndex = user.MostVisitedProduct.indexOf(checkData);
                user.MostVisitedProduct.splice(dataIndex, 1);
                user.MostVisitedProduct.unshift(checkData);
    
            }
            await user.save();
            res.send("Done");
        } catch (error) {
            return next(new validationerror(error.message, 401));
        }
       
    }

    async getMVP(req, res, next) {
        try {
            let user = await User.findOne({ userId: req.params.userId });
            let data = user.MostVisitedProduct;
            res.status(200).json({data});
        } catch (error) {
            return next(new validationerror(error.message, 401));
        }
       
    }
}


const mvpController = new MVPController();
module.exports = mvpController;