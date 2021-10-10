const User = require("./../../models/userRole/user")
const Product = require("./../../models/product/product")
const ProductPoints = require("./../../models/product/productPoints")
const ProductDiscount = require("./../../models/product/productDiscount")
const ProductImages = require("./../../models/product/productImages")
const validationerror = require("../../middleware/validationError")
const cartList = require('../../models/userFeaturesModel/cartModel');
const deliveryPage = require('../../models/userFeaturesModel/deliveryPageModel');
const wishList = require('../../models/userFeaturesModel/wishlistModel');

const { v4: uuidv4 } = require('uuid')
const moment = require("moment")

class ProductEditController {

    async updateQuantityProduct(req, res,next) {

        var userId = req.params.userId;
        var productId = req.body.productId;

        if(userId == req.auth.userId){
            let user = await User.findOne({ userId: userId});
            if (user == null) {
               return next(new validationerror("Process Failed, User not found", 400));
            }

            let productUpdate = await Product.findOne({ userId: userId, productId: productId});
            if (productUpdate == null) {
               return next(new validationerror("Process Failed, Product not found", 400));
            }

            let quantity = req.body.quantity || productEdit.quantity;

            productUpdate.quantity = quantity;
            productUpdate.updatedAt = moment(Date.now()).unix();

            await productUpdate.save()
            return res.status(200).json({message:"ok"})

        } else {
           return next(new validationerror("Process Failed, Unauthorized", 401));
        }

    }

    async updatePriceProduct(req, res,next){

        var userId = req.params.userId;
        var productId = req.body.productId;

        if(userId == req.auth.userId){
            let user = await User.findOne({ userId: userId});
            if (user == null) {
               return next(new validationerror("Process Failed, User not found", 400));
            }

            let productUpdate = await Product.findOne({ userId: userId, productId: productId});
            if (productUpdate == null) {
               return next(new validationerror("Process Failed, Product not found", 400));
            }

            let price = req.body.price || productEdit.price;

            productUpdate.price = price;
            productUpdate.updatedAt = moment(Date.now()).unix();

            await productUpdate.save()
            return res.status(200).json({message:"ok"})

        } else {
           return next(new validationerror("Process Failed, Unauthorized", 401));
        }

    }

    async updateColourProduct(req, res,next){

        var userId = req.params.userId;
        var productId = req.body.productId;

        if(userId == req.auth.userId){
            let user = await User.findOne({ userId: userId});
            if (user == null) {
               return next(new validationerror("Process Failed, User not found", 400));
            }

            let productUpdate = await Product.findOne({ userId: userId, productId: productId});
            if (productUpdate == null) {
               return next(new validationerror("Process Failed, Product not found", 400));
            }

            var result = req.body.colour;
            var data = result.map(e => {
                if (!productUpdate.colour.includes(e)) return e;
            });
            // // console.log(oldCartList);
            // // console.log(oldCartList.productId);
            data.forEach(d => {
                if (d != null)
                  productUpdate.colour.push(d)
            });
            // oldWishList.save();
            // let colour = data || productUpdate.colour;

            // productUpdate.colour = colour;
            productUpdate.updatedAt = moment(Date.now()).unix();

            await productUpdate.save()
            return res.status(200).json({message:"ok"})

        } else {
           return next(new validationerror("Process Failed, Unauthorized", 401));
        }

    }

    async addPointsProduct(req, res,next){

        var userId = req.params.userId;
        var productId = req.body.productId;

        if(userId == req.auth.userId){
            let user = await User.findOne({ userId: userId});
            if (user == null) {
               return next(new validationerror("Process Failed, User not found", 400));
            }

            let product = await Product.findOne({ userId: userId, productId: productId});
            if (product == null) {
               return next(new validationerror("Process Failed, Product not found", 400));
            }

            let points = req.body.points;

            let productUpdate = new ProductPoints({
                                    userId: userId,
                                    productId: productId,
                                    points: points,
                                    createdAt: moment(Date.now()).unix()
                                });

            await productUpdate.save()
            return res.status(200).json({"message":"ok"})

        } else {
            return next(new validationerror("Process Failed, Unauthorized", 401));
        }

    }

    async updatePointsProduct(req, res,next){

        var userId = req.params.userId;
        var productId = req.body.productId;

        if(userId == req.auth.userId){
            let user = await User.findOne({ userId: userId});
            if (user == null) {
                return next(new validationerror("Process Failed, User not found", 400));
            }

            let product = await Product.findOne({ userId: userId, productId: productId});
            if (product == null) {
                return next(new validationerror("Process Failed, Product not found", 400));
            }

            let productUpdate = await ProductPoints.findOne({userId:userId, productId:productId});
            if (productUpdate == null) {
                return next(new validationerror("Process Failed, Product points not found", 400));
            }

            let points = req.body.points || productUpdate.points;

            productUpdate.points = points
            productUpdate.updatedAt = moment(Date.now()).unix()

            await productUpdate.save()
            return res.status(200).json({"message":"ok"})

        } else {
            return next(new validationerror("Process Failed, Unauthorized", 401));
        }

    }

    async addDiscountProduct(req, res,next){

        var userId = req.params.userId;
        var productId = req.body.productId;

        if(userId == req.auth.userId){
            let user = await User.findOne({ userId: userId});
            if (user == null) {
                return next(new validationerror("Process Failed, User not found", 400));
            }

            let product = await Product.findOne({ userId: userId, productId: productId});
            if (product == null) {
                return next(new validationerror("Process Failed, Product not found", 400));
            }

            let discount = req.body.discount;

            let productUpdate = new ProductDiscount({
                                    userId: userId,
                                    productId: productId,
                                    discount: discount,
                                    createdAt: moment(Date.now()).unix()
                                });

            await productUpdate.save()
            return res.status(200).json({"message":"ok"})

        } else {
            return next (new validationerror("Process Failed, Unauthorized", 401));
        }

    }

    async updateDiscountProduct(req, res,next){

        var userId = req.params.userId;
        var productId = req.body.productId;

        if(userId == req.auth.userId){
            let user = await User.findOne({ userId: userId});
            if (user == null) {
               return next(new validationerror("Process Failed, User not found", 400));
            }

            let product = await Product.findOne({ userId: userId, productId: productId});
            if (product == null) {
               return next(new validationerror("Process Failed, Product not found", 400));
            }

            let productUpdate = await ProductDiscount.findOne({userId:userId, productId:productId});
            if (productUpdate == null) {
               return next(new validationerror("Process Failed, Product discount not found", 400));
            }

            let discount = req.body.discount || productUpdate.discount;

            productUpdate.discount = discount
            productUpdate.updatedAt = moment(Date.now()).unix()

            await productUpdate.save()
            return res.status(200).json({"message":"ok"})

        } else {
            return next(new validationerror("Process Failed, Unauthorized", 401));
        }

    }

    async deleteProduct(req,res,next){
        let userId = req.params.userId;
        // const delFood =  await foodData.findByIdAndDelete(req.params.id);
        const delFood =  await Product.deleteMany({});
        if(!delFood)
        {
            return next(new validationerror('No food found with that ID', 404));
        }
         res.send("Done");

}
async deleteCartList(req,res,next){
    let userId = req.params.userId;
    // const delFood =  await foodData.findByIdAndDelete(req.params.id);
    const delFood =  await cartList.deleteMany({});
    if(!delFood)
    {
        return next(new validationerror('No food found with that ID', 404));
    }
     res.send("Done");

}
async deleteWishList(req,res,next){
    let userId = req.params.userId;
    // const delFood =  await foodData.findByIdAndDelete(req.params.id);
    const delFood =  await wishList.deleteMany({});
    if(!delFood)
    {
        return next(new validationerror('No food found with that ID', 404));
    }
     res.send("Done");

}
async deleteDeliveryPage(req,res,next){
    let userId = req.params.userId;
    // const delFood =  await foodData.findByIdAndDelete(req.params.id);
    const delFood =  await deliveryPage.deleteMany({});
    if(!delFood)
    {
        return next(new validationerror('No food found with that ID', 404));
    }
     res.send("Done");

}
}

const productEditController = new ProductEditController()
module.exports = productEditController
