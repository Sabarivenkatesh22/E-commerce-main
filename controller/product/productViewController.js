const User = require("./../../models/userRole/user")
const Product = require("./../../models/product/product")
const review = require("./../../models/product/reviewModel");
const validationerror = require("../../middleware/validationError");

class ProductViewController {

    async productView(req, res,next) {
        try {
            // make sure that two populate works
            const product = await Product.findOne({ productId: req.params.productId }).populate('reviews')
            .populate({
                path: "discount",
                select: 'discount'
            });
            // const reviewCustomerId = product.reviews[0].customerId;
            // console.log(reviewCustomerId);
            // const Review = await review.findOne({customerId: reviewCustomerId}).populate('userDetails');
            console.log(product);
            res.status(200).json({
                result: product.length,
                data: [
                    product
                ],
                // reviews:[
                //     Review
                // ]
            })
        } catch (error) {
           return next(new validationerror(error.message, 400));
        }

    }

    async allProducts(req, res,next) {
        try {
            const product = await Product.find().populate({
                path: "discount",
                select: 'discount'
            });
            res.status(200).json({
                status: "success",
                results: product.length,
                product

            });
        } catch (err) {
            return next(new validationerror("Process Failed, Unauthorized", 401));
        }
    }

};


const productViewController = new ProductViewController();
module.exports = productViewController;
