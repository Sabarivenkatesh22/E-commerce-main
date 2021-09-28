// const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const env = require('dotenv');
env.config();
const deliveryController = require('../controller/user/deliveryPageController');

// const app = express();
// app.set('views', 'views');
// app.set('view engine', 'ejs');
// app.use(express.json());

var razorpay = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET
});
class RazorPay {
    sendOrderId(req, res) {
        // app.post('/orders', (req, res) => {

        console.log(req.body);
        var options = {
            amount: 500 * 100,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_11"
        };
        // this.status = "processing";
        // this.customerId = req.params.userId;
        // this.productId = req.params.productId;
        razorpay.orders.create(options, function (err, order) {
            console.log(order);
            // save this order id to database with field name (order.id)
            res.json(order);
        });


    };
    // async processOrder(result) {
    //     // app.post('/orders', (req, res) => {

    //            if(result == "True")
    //            {
    //                await Delivery
    //            }
    // };



    // app.get('/', (req, res) => {
    //     res.render('razorpay.ejs');
    //     // else{
    //     //     res.redirect('/');
    //     // }
    // });
    orderSuccessful(req, res) {
        // app.post('/orderSuccessful', (req, res) => {
        console.log(req.body);

        // res.send("Payment Successful");
        let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;

        var expectedSignature = crypto.createHmac('sha256', 'yucgjK15qP3VJNKntWfi6sG0')
            .update(body.toString())
            .digest('hex');
        console.log("sig received ", req.body.response.razorpay_signature);
        console.log("sig generated ", expectedSignature);
        var response = { "signatureIsValid": "false" }
        if (expectedSignature === req.body.response.razorpay_signature) {
            response = { "signatureIsValid": "true" };
            // this.processOrder("True");
            var Status = req.body.status;
            var userId = req.body.userId;
            var productId = req.body.productId,
                data = {
                    userId,
                    productId,
                    status: Status
                };
           var result =  deliveryController.manualUpdateDeliveryItem(data);
        //    returns a promise 
        //    console.log(result);
        }

        res.send(response);
    };
    orderFailed(req, res) {
        // app.post('/orderFailed', (req, res) => {
        console.log(req.body);

        response = { "signatureIsValid": "false" }
        res.send(response);
    };
}


const razorPay = new RazorPay();
module.exports = razorPay;











// app.listen(5000, () => {
//     console.log(`App running on port 5000`);
// });


