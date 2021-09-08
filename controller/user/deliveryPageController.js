const User = require("../../models/userRole/user");
const validationerror = require("../../middleware/validationError");
const DeliveryPage = require("../../models/userFeaturesModel/deliveryPageModel");
const product = require("../../models/product/product");

class DeliveryPageController {
    //  create delivery page when user purchases the product

    async createDeliveryPage(req,res) {

        try {
            // data = {
            //     customerId: req.params.userId
            // };
            const deliveryPage = await DeliveryPage.create({
                customerId: req.params.userId
            });
            // res.send(deliveryPage);
            
            res.send("Done");
        } catch (error) {
            res.status(401).json(new validationerror(error.message, 401));
        }
        // req.body -> should have product id 
        // var userId = req.params.userId;
        // req.body.customerId = userId;
       
        // this.getDeliveryPage(req.params.userId, res);
        // res.status(200).json({
        //     status:'success',
        //     results: deliveryPage.length,
        //     data:{
        //         deliveryPage
        //     }
        // });
     

    }
    //   updating only the status of the pacakge 

    async updateDeliveryItem(req, res) {
        try {
            // req.body -> should have product id 
            // req.body.customerId = userId;
            // data = {
            //     productId: req.body.productId,
            //     customerId: userId
            // };
            const deliveryPage = await DeliveryPage.findOneAndUpdate({ customerId: req.params.userId }, req.body.productId, {
                new: true,
            });

            const statusOfProduct = deliveryPage.status;
            
            res.status(200).json({
                status: 'success',
                results: deliveryPage.length,
                data: {
                    deliveryPage
                }
            });

            const deliveredProduct = await product.findOne(req.body.productId);
            if(statusOfProduct == "processing"){
                deliveredProduct.sold = deliveredProduct.sold + 1 ;
                deliveredProduct.quantity = deliveredProduct.quantity - 1 ;
            }
            if(statusOfProduct == "cancelled"){
                deliveredProduct.sold = deliveredProduct.sold - 1 ;
                deliveredProduct.quantity = deliveredProduct.quantity + 1 ;
            }
            // add points to userModel if the status is delivered
            await deliveredProduct.save();
        } catch (err) {
            res.status(401).json(new validationerror(err, 401));
        }
    }

    async getDeliveryPage(req, res) {

        const deliveryPage = await DeliveryPage.find({ customerId: req.params.userId }).populate('productDetails');

        if (!deliveryPage) res.status(401).json(new validationerror("Process Failed, not a valid ID", 401));

        else res.status(200).json({
            status: 'success',
            results: deliveryPage.length,
            data: {
                deliveryPage
            }
        });

    }
    async deleteDeliveryItem(req, res) {
        try {
            const delDelivery = await DeliveryPage.findOneAndUpdate({ customerId: req.params.userId });
                var result = req.body.productId;
                var index ;
                result.forEach(e => {
                    if (delDelivery.productId.includes(e)) {
                        index =delDelivery.productId.indexOf(e);
                        if (index > -1) {
                            delDelivery.productId.splice(index, 1);
                        }
                    }
                    // console.log(data);
                });
                await delDelivery.save();
                res.send("Done");
        } catch (error) {
            res.status(401).json(new validationerror(error.message, 401));
        }
        


    }


}


const deliveryPageController = new DeliveryPageController();
module.exports = deliveryPageController;