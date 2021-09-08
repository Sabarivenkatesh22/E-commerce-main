const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productImageSchema = new Schema(
    {
        productId: {
          type: String,
          required:true
        },
        userId: {
          type: String,
          required:true
        },
        images: {
            type: String
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

const ProductImages = mongoose.model("productImages", productImageSchema);
module.exports = ProductImages;
