const User = require("./../../models/userRole/user")
const Product = require("./../../models/product/product")
const validationerror = require("../../middleware/validationError");

const { v4: uuidv4 } = require('uuid')
const moment = require("moment")

class ProductAddController {

    async addProduct(req, res,next){

        // console.log("from product add controller");
        var userId = req.params.userId;

        try {
            let user = await User.findOne({ userId: userId});
            // if (user == null) {
            //     return next (new validationerror("Process Failed, User not found", 400));
            // }
            
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
        } catch (error) {
            console.error(error);
            return next (new validationerror(error.message, 400));
            
        }
            

        } 
    }



const productAddController = new ProductAddController()
module.exports = productAddController
