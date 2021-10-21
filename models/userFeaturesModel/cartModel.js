const mongoose = require("mongoose");

const cartlistSchema = new mongoose.Schema({
    productId:[
        {
            type:String,
        }
    ],
    
    customerId:{
        type:String,
        unique:true
    }  

},
{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  
  });

cartlistSchema.virtual('productDetails',{
    ref:'product',
    foreignField:'productId',
    localField:'productId'
  });
// cartlistSchema.pre(/^find/, function (next) {
//     console.log("from pre middleware");
//     // this.populate({
//     //     path:'userDetails',
//     //     select:'username verified'
//     // });
//     this.populate({ path: "productDetails"
// });
//     next();
// });
const cartlistModel = mongoose.model("cartlistModel",cartlistSchema);

module.exports = cartlistModel;