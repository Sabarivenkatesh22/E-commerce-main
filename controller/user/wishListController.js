const User = require("../../models/userRole/user");
const validationerror = require("../../middleware/validationError");
const Wishlist = require("../../models/userFeaturesModel/wishlistModel");

class WishListController {
    //  when user get the first verification as true we will create a empty wishlist
    async makeWishList(userId) {
        try {
            console.log("from createWishList");
            // req.body -> should have product id 
            // var userId = req.params.userId;
            // req.body.customerId = userId;
            // data = {
            //     customerId: req.params.userId
            // };
            const newWishList = await Wishlist.create({
                customerId: userId
            });
            return "Done";
        } catch (error) {
            return "error";

        }


    }

    async createWishList(req, res) {
        try {
            console.log("from createWishList");
            // req.body -> should have product id 
            // var userId = req.params.userId;
            // req.body.customerId = userId;
            // data = {
            //     customerId: req.params.userId
            // };
            const newWishList = await Wishlist.create({
                customerId: req.params.userId
            });
            res.send("Done");
        } catch (error) {
            res.status(401).json(new validationerror(error.message, 401));

        }


    }

    async updateWishList(req, res) {
        try {

            // req.body -> should have product id 
            // req.body.customerId = userId;
            // data = {
            //     productId: req.body.productId,
            //     customerId: userId
            // };
            console.log("hello from updateWishList");
            const oldWishList = await Wishlist.findOne({ customerId: req.params.userId });
            // const newProduct = oldWishList.productId.push(req.body.productId);
            console.log(...req.body.productId)
            // const data = req.body.productId ;
            // data.map(d=>oldWishList.productId.push(d));
            // console.log(data);
            // oldWishList.save();
            var result = req.body.productId;
            var data = result.map(e => {
                if (!oldWishList.productId.includes(e)) return e;
            });
            // console.log(oldCartList);
            // console.log(oldCartList.productId);
            data.forEach(d => {
                if (d != null)
                    oldWishList.productId.push(d)
            });
            await oldWishList.save();
            // const newWishList = await Wishlist.findOneAndUpdate({ customerId: req.params.userId}, {$set:{productId: data}},{
            //     new: true,
            // });
            // const newWishList = await Wishlist.findOne({ customerId: req.params.userId});
            res.status(200).json({
                status: 'success',
                results: oldWishList.length,
                data: {
                    wishlist: oldWishList
                }
            });
            console.log(oldWishList);
        } catch (err) {
            res.status(401).json(new validationerror(err.message, 401));
        }
    }

    async getWishList(req, res) {

        const newWishList = await Wishlist.find({ customerId: req.params.userId }).populate('productDetails');

        if (!newWishList) res.status(401).json(new validationerror("Process Failed, not a valid ID", 401));

        else res.status(200).json({ newWishList })

    }

    async deleteWishList(req, res) {
        try {
            var result = req.body.productId;
            const newWishList = await Wishlist.findOne({ customerId: req.params.userId });
            var result = req.body.productId;
            var index ;
            result.forEach(e => {
                if (newWishList.productId.includes(e)) {
                    index =newWishList.productId.indexOf(e);
                    if (index > -1) {
                        newWishList.productId.splice(index, 1);
                    }
                }
                // console.log(data);
            });
            // console.log(delCartList);
            // console.log(delCartList.productId);
           
            // data.forEach(d => {
            //     if (d != null)
            //         newWishList.productId.push(d)
            // });
            // newWishList.productId = data;
            await newWishList.save();
            res.send("Done");
        } catch (error) {
            res.status(401).json(new validationerror(error.message, 401));
        }



    }


}

const wishListController = new WishListController();
module.exports = wishListController;
