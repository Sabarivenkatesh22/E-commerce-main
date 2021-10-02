const mongoose = require("mongoose");
//  make a api to update the status regularly
const deliveryPageSchema = new mongoose.Schema({
    // productId:[
    //     [
    //         {
    //             type:String,
               
    //         },
    //         {
    //             type:String,
    //             enum:["packed","processing","inStation","readyToDelivery","delivered","cancelled"],
    //             default:"processing",
    //         }
    //     ],

        
        //     productId: [{
        //       ProductId: {
        //         type: String                  
        //       },
        //       status: {
        //         type:String,
        //         enum:["packed","processing","inStation","readyToDelivery","delivered","cancelled"],
        //         default:"processing",                  
        //       }
        //   }],

          productId: {
            type : [{
              ProductId: {
                type: String                  
              },
              status: {
                type:String,
                enum:["packed","processing","inStation","readyToDelivery","delivered","cancelled"],
                default:"processing",                  
              }              
              
          }],
          default :[{status : "processing"}]
        },
        //   default :[{status : "processing"}],
        //   enum:[{status:"packed","processing","inStation","readyToDelivery","delivered","cancelled"}]
        
    


        // statusOfProduct:{
        //     type:String,
        //     enum:["packed","processing","inStation","readyToDelivery","delivered","cancelled"],
        //     default:"processing",
        // }
    
    
    // ],
    
    customerId:{
        type:String
    },
    
    // [packed,processing,inStation,readyToDelivery]
    // status:{
    //     type:String,
    //     enum:["packed","processing","inStation","readyToDelivery","delivered","cancelled"],
    //     default:"processing",
    // }

},
{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  
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



// const TesterSchema = new Schema({  
//     field1: {
//       type: String,
//       trim: true
//     },
//     field2: {
//       type : [{
//         subField1: {
//           type: String                  
//         },
//         subField2: {
//           type: Number                  
//         }
//     }],
//     default :[{subField2 : '0'}]
//   }
// }
// );