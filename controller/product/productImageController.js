const User = require("./../../models/userRole/user")
const Product = require("./../../models/product/product")
const ProductImages = require("./../../models/product/productImages")
const validationerror = require("../../middleware/validationError")

const { v4: uuidv4 } = require('uuid')
const moment = require("moment")

class ProductImageController {

    async addImagesProduct(req, res){

        var userId = req.params.userId;
        var productId = req.body.productId;

        if(userId == req.auth.userId){

            let user = await User.findOne({ userId: userId});
            if (user == null) {
                res.status(400).json(new validationerror("Process Failed, User not found", 400));
            }

            let product = await Product.findOne({productId:productId, userId:userId});
            if (product == null) {
                res.status(400).json(new validationerror("Process Failed, Product not found", 400));
            }

            let productUpdate = new productImage({
                                userId: userId,
                                productId: productId,
                                createdTime: moment(Date.now()).unix()
                            })

            /*if(req.file){  //Single file
                productImage.image = req.file.path
            }*/

            if(req.files) {
                let path = ''
                req.files.forEach(function(files, index, arr){
                  path = path + files.path + ','
                })
                path = path.substring(0, path.lastIndexOf(","))
                productUpdate.images = path
            }

            await productUpdate.save();

            res.status(200).json({message:"ok"});
        }
        else {
            res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
        }

    }

    async updateImagesProduct(req, res){

    }

    async viewImagesProduct(req, res){

        if(userId == req.auth.userId){

            var productId = req.params.productId;

            let product = await Product.findOne({productId:productId});
            if (product == null) {
                res.status(400).json(new validationerror("Process Failed, Product not found", 400));
            }

            let productImage = await ProductImages.findOne({
                productId: productId
            });

            if(productImage == null){
                res.status(400).json(new validationerror("Process Failed, Image not found.", 400));
            }

            res.status(200).json({productId:productImage.productId, path:productImage.images });

        } else {
            res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
        }

    }

}

const productImageController = new ProductImageController()
module.exports = productImageController
