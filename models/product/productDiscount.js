const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productDiscountSchema = new Schema(
    {
        productId: {
          type: String,
          required:true
        },
        userId: {
          type: String,
          required:true
        },
        discount: {
          type: Number,
          required: true,
          default: 0
        },
        createdAt: {
          type: Number
        },
        updatedAt:{
          type: Number,
          default: 0
        }
    },
    {
      timestamps: true
    }
);

// var dateString = moment.unix(value).format("MM/DD/YYYY");

const ProductDiscount = mongoose.model("productDiscount", productDiscountSchema);
module.exports = ProductDiscount;
