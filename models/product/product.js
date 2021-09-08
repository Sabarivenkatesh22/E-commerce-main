const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    productId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true,
      maxlength: 32
    },
    userId: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true,
      maxlength: 500
    },
    price: {
      type: Number,
      trim: true,
      required: true,
      maxlength: 32
    },
    category: {
      type: String,
      ref: 'Category',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    colour: [{
      type: String
    }],
    sold: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Number
    },
    updatedAt: {
      type: Number,
      default: 0
    },
    cartListUserId:({
      type: String,
      unique: true
    }),
    cartListId:{
      type: String
    }
    // wishListUserId: [{
    //   type: String
    // }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }

  }
);
// This populate will work only when we manually populate it.
productSchema.virtual('productHistory', {
  ref: 'productHistoryModel',
  foreignField: 'productId',
  localField: 'productId'
});

productSchema.virtual('reviews', {
  ref: 'review',
  foreignField: 'productId',
  localField: 'productId'
});

productSchema.virtual('cartListUserDetails',{
  ref:'user',
  foreignField: 'userId',
  localField: 'cartListUserId'
});
productSchema.virtual('discount',{
  ref:'productDiscount',
  foreignField: 'productId',
  localField: 'productId'
});

const Product = mongoose.model("product", productSchema);
module.exports = Product;
