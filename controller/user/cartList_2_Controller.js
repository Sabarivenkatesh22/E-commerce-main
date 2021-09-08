const User = require("../../models/userRole/user");
const validationerror = require("../../middleware/validationError");
const Cart = require("../../models/userFeaturesModel/cartModel");
const Product = require("../../models/product/product");

class CartList 
{
    async createCartList(req,res)
    {
        try {
            // req.body -> should have product id 
       // var userId = req.params.userId;
       // req.body.customerId = userId;
       
    const CartList = await Cart.create({
     customerId: req.params.userId
 });

 res.send("Done");
        } catch (error) {
            res.status(401).json(new validationerror(error.message, 401));

        }
       
   }

   async updateCartList(req, res) {
       try {
           // req.body -> should have product id 
           // req.body.customerId = userId;
           // data = {
           //     productId: req.body.productId,
           //     customerId: userId
           // };
        console.log("from cartList");
          var product = req.body.productId;
          var cartListUserId = req.params.userId;
          console.log(product);
          var productPage,data,productUserId;
           product.forEach(async function(p){
               try {
                 productPage = await Product.findOne({productId: p});
                 console.log(productPage.quantity);
                //  productUserId = productPage.cartListUserId;
                 
                    if (! productPage.cartListUserId.includes(cartListUserId)) {
                        productPage.cartListUserId.push(req.params.userId);
                    }
                
              
                console.log(productPage.cartListUserId);
               await  productPage.save();
            }
                catch (error) {
                   console.log(error.message);
         
           }
        //    productPage.save();
        });
        //    productPage.save();
           const cartPage = await Product.find({ customerId: req.params.userId})
        //    const map1 = array1.map(x => x * 2);
        //    const CartList = await Cart.findOneAndUpdate({ customerId: req.params.userId}, req.body.productId,{
        //        new: true,
        //    });

          res.send("done");
       } catch (err) {
           res.status(401).json(new validationerror(err, 401));
       }
   }

//    async getCartList(req,res) {

//       const CartList = await Cart.find({ customerId: req.params.userId}).populate('productDetails');

//       if(!CartList) res.status(401).json(new validationerror("Process Failed, not a valid ID", 401));

//       else res.status(200).json({CartList})

//    };

async getCartList(req,res) {

    try {
        const product = Product.find({cartListUserId:req.params.userId});
    // console.log(product);
    console.log(product.cartListId);
    product.cartListId = req.params.userId;
    const newProduct = await product.populate('cartListUserDetails');
    // product.cartListUserId.includes(req.params.userId);
    res.status(200).json({newProduct})
    } catch (error) {
        res.status(401).json(new validationerror(error.message, 401));
    }
    
    // const CartList = await Cart.find({ customerId: req.params.userId}).populate('productDetails');

   

 };


}


const cartList = new CartList();
module.exports = cartList;