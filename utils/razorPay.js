// const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');

// const app = express();
// app.set('views', 'views');
// app.set('view engine', 'ejs');
// app.use(express.json());

var razorpay = new Razorpay({
    key_id: 'rzp_test_6ay4jdltXWVRlt',
    key_secret: 'yucgjK15qP3VJNKntWfi6sG0'
});
class RazorPay {
    async sendOrderId(req, res) {
        // app.post('/orders', (req, res) => {
            
                console.log(req.body);
               var options = {
                    amount: 500 * 100,  // amount in the smallest currency unit
                    currency: "INR",
                    receipt: "order_rcptid_11"
                };
                razorpay.orders.create(options, function (err, order) {
                    console.log(order);
                    // save this order id to database with field name (order.id)
                    res.json(order);
                });
         
        
    };




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
        if (expectedSignature === req.body.response.razorpay_signature)
            response = { "signatureIsValid": "true" }
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


