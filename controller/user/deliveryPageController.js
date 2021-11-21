const User = require("../../models/userRole/user");
const validationerror = require("../../middleware/validationError");
const DeliveryPage = require("../../models/userFeaturesModel/deliveryPageModel");
const product = require("../../models/product/product");

class DeliveryPageController {
    //  create delivery page when user purchases the product

    async makeDeliveryPage(userId) {
        try {
            // data = {
            //     customerId: req.params.userId
            // };
            const deliveryPage = await DeliveryPage.create({
                customerId: userId,
            });
            // res.send(deliveryPage);

            return "Done";
        } catch (error) {
            return "error";
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
    async createDeliveryPage(req, res,next) {
        try {
            // data = {
            //     customerId: req.params.userId
            // };
            const deliveryPage = await DeliveryPage.create({
                customerId: req.params.userId,
            });
            // res.send(deliveryPage);

            res.send("Done");
        } catch (error) {
           return next(new validationerror(error.message, 401));
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

    async manualUpdateDeliveryItem(data) {
        try {
            // req.body -> should have product id
            // req.body.customerId = userId;
            // data = {
            //     productId: req.body.productId,
            //     customerId: userId
            // };
            console.log("data");
            console.log(data);
            const deliveryPage = await DeliveryPage.findOne(
                { customerId: data.userId });
              
            

            // var result = data.productId[0];
            data.productId[0].push("processing");
           deliveryPage.productId.push(data.productId[0]);
            // // // console.log(oldCartList);
            // // // console.log(oldCartList.productId);
            // data_res.forEach(d => {
            //     if (d != null)
            //         deliveryPage.productId.push(d)
            // });
            // await oldWishList.save();

            // deliveryPage.productId = data.productId;
            // deliveryPage.status = data.status;

            const statusOfProduct = data.productId[1];
            // console.log(statusOfProduct);
            // console.log("deliveryPage");
            // console.log(deliveryPage);
                deliveryPage.save();
            // res.status(200).json({
            //     status: 'success',
            //     results: deliveryPage.length,
            //     data: {
            //         deliveryPage
            //     }
            // });

            const deliveredProduct = await product.findOne(data.productId);
            if (statusOfProduct == "processing") {
                deliveredProduct.sold = deliveredProduct.sold + 1;
                deliveredProduct.quantity = deliveredProduct.quantity - 1;
            }
            if (statusOfProduct == "cancelled") {
                deliveredProduct.sold = deliveredProduct.sold - 1;
                deliveredProduct.quantity = deliveredProduct.quantity + 1;
            }
            // add points to userModel if the status is delivered
            await deliveredProduct.save();
            return "Done";
        } catch (err) {
            //return next(new validationerror(err, 401));
            return "error";
        }
    }
    async updateDeliveryItem(req, res,next) {
        try {
            // req.body -> should have product id
            // req.body.customerId = userId;
            // data = {
            //     productId: req.body.productId,
            //     customerId: userId
            // };
            const deliveryPage = await DeliveryPage.findOne(
                { customerId: req.params.userId }
    
            );
            const user = await User.findOne({userId: req.params.userId});
            // TODO: DO THIS ASS FAST AS POSSIBLE

            deliveryPage.productId.forEach((e)=>{
                if(e[0] == req.params.productId) e[1] = req.body.status;
            });
            await deliveryPage.save();
            const statusOfProduct = req.body.status;

            res.status(200).json({
                status: "success",
                results: deliveryPage.length,
                data: {
                    deliveryPage,
                },
            });

            const deliveredProduct = await product.findOne(req.params.productId);
            if (statusOfProduct == "processing") {
                deliveredProduct.sold = deliveredProduct.sold + 1;
                deliveredProduct.quantity = deliveredProduct.quantity - 1;
            }
            if (statusOfProduct == "cancelled") {
                deliveredProduct.sold = deliveredProduct.sold - 1;
                deliveredProduct.quantity = deliveredProduct.quantity + 1;
            }
            if(statusOfProduct == "delivered"){
                user.NumberOfSuccessfulOrders = user.NumberOfSuccessfulOrders + 1;
            }
            // add points to userModel if the status is delivered
            await deliveredProduct.save();
        } catch (err) {
           return next(new validationerror(err, 401));
        }
    }

    async getDeliveryPage(req, res,next) {
        const deliveryPage = await DeliveryPage.findOne({
            customerId: req.params.userId,
        });
        // .populate("productDetails");
        // deliveryPage.productId.forEach(async (e) =>{

        // });

        console.log(deliveryPage);
        if (!deliveryPage)
            return next (new validationerror("Process Failed, not a valid ID", 401));
        else
            res.status(200).json({
                status: "success",
                results: deliveryPage.length,
                data: {
                    deliveryPage,
                },
            });
    }
    async deleteDeliveryItem(req, res,next) {
        try {
            const delDelivery = await DeliveryPage.findOneAndUpdate({
                customerId: req.params.userId,
            });
            var result = req.body.productId;
            var index;
            result.forEach((e) => {
                if (delDelivery.productId.includes(e)) {
                    index = delDelivery.productId.indexOf(e);
                    if (index > -1) {
                        delDelivery.productId.splice(index, 1);
                    }
                }
                // console.log(data);
            });
            await delDelivery.save();
            res.send("Done");
        } catch (error) {
           return next(new validationerror(error.message, 401));
        }
    }
}

const deliveryPageController = new DeliveryPageController();
module.exports = deliveryPageController;

// http://tl-mode-secondary-backend.herokuapp.com/api/user/5acb5a21-fcd0-46bd-a430-e0a2564734bc/updateCartlist
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YWNiNWEyMS1mY2QwLTQ2YmQtYTQzMC1lMGEyNTY0NzM0YmMiLCJyb2xlIjoiYnV5ZXIiLCJpYXQiOjE2MzM1OTkwNTEsImV4cCI6MTYzNDgwODY1MX0.7faow7fJtfUA30Yi-0g20EzKI26rIDhOcnsgTOYkYiI
// {"productId":["e3598c0a-3b18-43c1-9a49-d6ce9f175350"]}
// {"status":"error","message":"Something went very wrong!"}