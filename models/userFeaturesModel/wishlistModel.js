const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema({
    productId:[
        {
            type:String
        }
    ],
    
    customerId:{
        type:String
    }  

},
   
{
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
  });

wishListSchema.virtual('productDetails',{
    ref:'product',
    foreignField:'productId',
    localField:'productId'
  });
  


const wishListModel = mongoose.model("wishlistModel",wishListSchema);

module.exports = wishListModel;