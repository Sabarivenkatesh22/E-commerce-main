const User = require("../../models/userRole/user");
const validationerror = require("../../middleware/validationError");
const Cart = require("../../models/userFeaturesModel/cartModel");
const Product = require("../../models/product/product");

class CartListController {
    async makeCartList(userId) {
        try {
            // req.body -> should have product id 
            // var userId = req.params.userId;
            // req.body.customerId = userId;

            const CartList = await Cart.create({
                customerId: userId
            });

            //  res.send("Done");
            return "Done";
            // res.status(200).json({ CartList });
        } catch (error) {
            //return next(new validationerror(error.message, 401));
            return error.message;

        }

    }

    async createCartList(req, res, next) {
        try {
            // req.body -> should have product id 
            // var userId = req.params.userId;
            // req.body.customerId = userId;

            const CartList = await Cart.create({
                customerId: req.params.userId
            });

            res.send("Done");
            // res.status(200).json({ CartList });
        } catch (error) {
            return next(new validationerror(error.message, 401));

        }

    }

    async updateCartList(req, res, next) {
        try {
            // req.body -> should have product id 
            // req.body.customerId = userId;
            // data = {
            //     productId: req.body.productId,
            //     customerId: userId
            // };
            console.log("hello from updateCartList");
            const oldCartList = await Cart.findOne({ customerId: req.params.userId });
            // const newProduct = oldWishList.productId.push(req.body.productId);
            console.log(...req.body.productId)
            var result = req.body.productId;
            // var count =0;
            // var product;
            // result.forEach( async function(e){
            //      product = await Product.findOne({ productId: e });
            //      console.log("from loop");
            //      console.log(product.productId);
            //      if(product) {
            //         count = count +1;
            //     console.log(count);}
            // })

            // console.log(count,result.length);
            // if (count == result.length) {
            var data = result.map(e => {
                if (!oldCartList.productId.includes(e)) return e;
            });
            console.log(oldCartList);
            console.log(oldCartList.productId);
            data.forEach(d => {
                if (d != null)
                    oldCartList.productId.push(d)
            });
            console.log(oldCartList);
            // oldCartList.save();
            //    const CartList = await Cart.findOneAndUpdate({ customerId: req.params.userId}, req.body.productId,{
            //        new: true,
            //    });
            await oldCartList.save();
            res.status(200).json({
                status: 'success',
                results: oldCartList.length,
                data: {
                    oldCartList
                }
            });


        } catch (err) {
            return next(new validationerror(err.message, 401));
        }

    }

    async getCartList(req, res, next) {

        const CartList = await Cart.find({ customerId: req.params.userId }).populate('productDetails');

        if (!CartList) return next(new validationerror("Process Failed, not a valid ID", 401));

        else res.status(200).json({ CartList })

    }
    async deleteCartList(req, res, next) {
        try {
            const deleteCartList = await Cart.findOneAndUpdate({ customerId: req.params.userId });
            var result = req.body.productId;
            var index;
            result.forEach(e => {
                if (deleteCartList.productId.includes(e)) {
                    index = deleteCartList.productId.indexOf(e);
                    if (index > -1) {
                        deleteCartList.productId.splice(index, 1);
                    }
                }
                // console.log(data);
                console.log("from deleteCartList");
            });
            await deleteCartList.save();
            res.send("Done");
        } catch (error) {
            return next(new validationerror(error.message, 401));
        }



    }


}


const cartListController = new CartListController();
module.exports = cartListController;