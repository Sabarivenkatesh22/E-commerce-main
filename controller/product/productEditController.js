const User = require("./../../models/userRole/user")
const Product = require("./../../models/product/product")
const validationerror = require("../../middleware/validationError");

const { v4: uuidv4 } = require('uuid')
const moment = require("moment")

class ProductEditController {

    async editProduct(req, res,next){

        var userId = req.params.userId;
        var productId = req.body.productId;

        if(userId == req.auth.userId){
            let user = await User.findOne({ userId: userId});
            if (user == null) {
                return next(new validationerror("Process Failed, User not found", 400));
            }

            let productEdit = await Product.findOne({ userId: userId, productId: productId});
            if (productEdit == null) {
                return next(new validationerror("Process Failed, Product not found", 400));
            }

            let title = req.body.title || productEdit.title;
            let description = req.body.description || productEdit.description;
            let category = req.body.category || productEdit.category;

            productEdit.title = title;
            productEdit.description = description;
            productEdit.category = category;
            productEdit.updatedAt = moment(Date.now()).unix();

            await productEdit.save()
            return res.status(200).json({"message":"ok"})

        } else {
            return next (new validationerror("Process Failed, Unauthorized", 401));
        }

    }

}

const productEditController = new ProductEditController()
module.exports = productEditController
