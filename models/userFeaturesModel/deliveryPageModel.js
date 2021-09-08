const mongoose = require("mongoose");
//  make a api to update the status regularly
const deliveryPageSchema = new mongoose.Schema({
    productId:[
        {
            type:String
        }
    ],
    
    customerId:{
        type:String
    },
    
    // [packed,processing,inStation,readyToDelivery]
    status:{
        type:String,
        enum:["packed","processing","inStation","readyToDelivery","delivered","cancelled"],
        default:"processing",
    }

});

deliveryPageSchema.virtual('productDetails',{
    ref:'product',
    foreignField:'productId',
    localField:'productId'
  });

deliveryPageSchema.virtual('userDetails',{
    ref:'user',
    foreignField:'userId',
    localField:'customerId'
  });


const deliveryPageModel = mongoose.model("deliveryPageModel",deliveryPageSchema);

module.exports = deliveryPageModel;