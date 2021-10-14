const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
    },
    customerId: {
      type: String,
    },
    title: {
      type: String,
      required: [true, "A review title is required!"],
    },
    description: {
      type: String,
      // required: [true, "A description should be provided!"],
    },
    rating: {
      type: Number,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.virtual("productDetails", {
  ref: "product",
  foreignField: "productId",
  localField: "productId",
});

reviewSchema.pre(/^find/, function (next) {
  console.log("from pre middleware");
  // this.populate({
  //     path:'userDetails',
  //     select:'username verified'
  // });
  this.populate({
    path: "userDetails",
    select: "username firstname verified",
  });
  next();
});

reviewSchema.post("findOne", function (doc) {
  console.log("doc is ", doc);
});

reviewSchema.virtual("userDetails", {
  ref: "user",
  foreignField: "userId",
  localField: "customerId",
});

const reviewModel = mongoose.model("review", reviewSchema);

module.exports = reviewModel;
