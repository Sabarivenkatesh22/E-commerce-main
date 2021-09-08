const User = require("./../../models/userRole/user")
const Product = require("./../../models/product/product")
const validationerror = require("../../middleware/validationError");

const { v4: uuidv4 } = require('uuid')
const moment = require("moment")

class ProductAddController {

    async addProduct(req, res){

        // console.log("from product add controller");
        var userId = req.params.userId;

        if(userId == req.auth.userId){
            let user = await User.findOne({ userId: userId});
            if (user == null) {
                res.status(400).json(new validationerror("Process Failed, User not found", 400));
            }
            
            let title = req.body.title;
            let productId = uuidv4();
            let description = req.body.description;
            let category = req.body.category;
            let quantity = req.body.quantity;
            let price = req.body.price;
            let colour = req.body.colour;

            let productAdd = new Product({
              productId: productId,
              title: title,
              userId: user.userId,
              description: description,
              category: category,
              quantity: quantity,
              price: price,
              colour: colour,
              createdAt: moment(Date.now()).unix()
            })

            await productAdd.save()
            return res.status(200).json({"message":"ok"})

        } else {
            res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
        }

    }

}

const productAddController = new ProductAddController()
module.exports = productAddController
