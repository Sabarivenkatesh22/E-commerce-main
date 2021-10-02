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
                // {
                //     productId: data.productId,
                //     status: data.status,
                // },
                // {
                //     new: true,
                // }
            

            // var result = data.productId[0];
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
                { customerId: req.params.userId , productId: req.params.productId},
    
            );
            deliveryPage.status = req.body.status;
            await deliveryPage.save();
            const statusOfProduct = deliveryPage.status;

            res.status(200).json({
                status: "success",
                results: deliveryPage.length,
                data: {
                    deliveryPage,
                },
            });

            const deliveredProduct = await product.findOne(req.body.productId);
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
        } catch (err) {
           return next(new validationerror(err, 401));
        }
    }

    async getDeliveryPage(req, res,next) {
        const deliveryPage = await DeliveryPage.findOne({
            customerId: req.params.userId,
        }).populate("productDetails");

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
