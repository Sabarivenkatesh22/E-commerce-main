const User = require("./../../models/userRole/user");
const Product = require("./../../models/product/product");
const Review = require("./../../models/product/reviewModel");
const validationerror = require("../../middleware/validationError");

class ReviewController {

    async addReview(req, res) {
        // userId and productId from params
        try {
            const review = await Review.create({
                customerId: req.params.userId, 
                productId: req.params.productId,
                review: req.body.review,
                rating: req.body.rating
            });
            res.send("Done");
        } catch (error) {
            res.status(400).json(new validationerror("Process Failed, review cannot be added", 400));
        }
       
    }
};


const reviewController = new ReviewController();
module.exports = reviewController;