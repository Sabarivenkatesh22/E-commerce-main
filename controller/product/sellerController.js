const User = require("./../../models/userRole/user")
const Product = require("./../../models/product/product")
// const review = require("./../../models/product/reviewModel");
const validationerror = require("../../middleware/validationError");

class SellerController {

    async sellerProductDisplay(req, res) {
        try {
            // make sure that two populate works
            const sellerProductView = await Product.find({userId: req.params.userId}).populate({
                path: "discount",
                select: 'discount'
            });
            // const reviewCustomerId = product.reviews[0].customerId;
            // console.log(reviewCustomerId);
            // const Review = await review.findOne({customerId: reviewCustomerId}).populate('userDetails');
            console.log(sellerProductView);
            res.status(200).json({
                status: "success",
                result: sellerProductView.length,
                data: [
                    sellerProductView
                ],
                // reviews:[
                //     Review
                // ]
            })
        } catch (error) {
            res.status(400).json(new validationerror(error.message, 400));
        }

    }

    // async allProducts(req, res) {
    //     try {
    //         const product = await Product.find().populate({
    //             path: "discount",
    //             select: 'discount'
    //         });
    //         res.status(200).json({
    //             status: "success",
    //             results: product.length,
    //             product

    //         });
    //     } catch (err) {
    //         res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    //     }
    // }

};


const sellerController = new SellerController();
module.exports = sellerController;
