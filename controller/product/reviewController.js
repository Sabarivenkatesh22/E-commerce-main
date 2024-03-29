const User = require("./../../models/userRole/user");
const Product = require("./../../models/product/product");
const Review = require("./../../models/product/reviewModel");
const validationerror = require("../../middleware/validationError");

class ReviewController {

    async addReview(req, res,next) {
        // userId and productId from params
        try {
            const review = await Review.create({
                customerId: req.params.userId, 
                productId: req.params.productId,
                title: req.body.title,
                description: req.body.description,
                rating: req.body.rating
            });
            res.send("Done");
        } catch (error) {
           return next(new validationerror("Process Failed, review cannot be added", 400));
        // return next(new validationerror(error.message, 400));
        }
       
    }

    async delReview(req, res,next) {
        try {
            var deletedReview = await Review.findOneAndDelete({ customerId: req.params.userId },{productId:req.params.productId});
            // var result = req.params.productId;
            // var index ;
            // result.forEach(e => {
            //     if (deletedReview.productId.includes(e)) {
            //         index =deletedReview.productId.indexOf(e);
            //         if (index > -1) {
            //             deletedReview.productId.splice(index, 1);
            //         }
            //     }
            //     // console.log(data);
            // });
            // await deletedReview.save();
            res.send("Done");
            
        } catch (error) {
           return next(new validationerror(error.message, 400));
        }
       
        
    }

    async updateReview(req, res,next) {
        // update review and rating
        try {
            var newReview = await Review.findOne({ customerId: req.params.userId },{productId: req.params.productId});
            newReview.review = req.body.review || newReview.review;
            newReview.rating = req.body.rating || newReview.rating;
            await newReview.save();
            res.send("Done");
        } catch (error) {
           return next(new validationerror(error.message, 400));
        }
    }

    async getAllReview(req, res,next) {
        try {
            var allreviews = await Review.find({ customerId: req.params.userId }).populate({
                 path:'productDetails',
                 select:'title price'});
            res.status(200).json({ allreviews})
        } catch (error) {
           return next(new validationerror(error.message, 400));
        }
    }
};


const reviewController = new ReviewController();
module.exports = reviewController;