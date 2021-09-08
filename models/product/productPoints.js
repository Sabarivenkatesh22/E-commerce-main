const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productPointsSchema = new Schema(
    {
        productId: {
          type: String,
          required:true
        },
        userId: {
          type: String,
          required:true
        },
        points: {
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

const ProductPoints = mongoose.model("productPoints", productPointsSchema);
module.exports = ProductPoints;
