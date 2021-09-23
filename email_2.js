// const nodemailer = require('nodemailer');
const sgMail = require("@sendgrid/mail");
const env = require('dotenv');
env.config();

//   sender=`Sabari venkatesh <${process.env.EMAIL_FROM}>`;
//   receiver=process.env.EMAIL_TO;

//   {/* `Jonas Schmedtmann <${process.env.EMAIL_FROM}>` */}
//   // 1) Create a transporter
//   const transporter = nodemailer.createTransport(
//     {
//       service:'SendGrid',
//     auth: {
//       // type:'OAuth2',
//       user: 'apikey',
//       pass: 'SG.GbeT5mA9QICfwSX69B0dLA.xJ67qT3aGegJBgXGhdd1aCGaAG0YX7hjJNoTm7LVJhw'
//     }
//   });

//   // 2) Define the email options
//   const mailOptions = {
//     from: 'sabarishkrish148@gmail.com',
//     to: 'krishshavi2010@gmail.com',
//     subject: "Hello this is from Sabari",
//     text: "We have a update for you"
//     // html:
//   };

//   // 3) Actually send the email
//   transporter.sendMail(mailOptions, function(err, data) {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log('Email sent successfully');
//     }
// });

// // module.exports = sendEmail;
let name = "Georgekutty";
sgMail.setApiKey(
  process.env.SENDGRID_PASSWORD
);
// console.log(process.env.SENDGRID_PASSWORD);
const msg = {
  // 'krishkrishavi2010@gmail.com'
  // to: ['example1@mail.com', 'example2@mail.com'],
  // to: ['124003251@sastra.ac.in','deepikaks95@gmail.com'],
  // to: "sabarishkrish148@gmail.com <sabarishkrish148@gmail.com>", 
  to: "deepikaks95@@gmail.com <deepikaks95@@gmail.com >", // Change to your recipient
  from: "TLMode <krish0postman@gmail.com>", // Change to your verified sender
  subject: "UNGA LAZYPANDAW",
  text: "Hello there this is SABARI",
  html: `<strong> Hello Raghul bro UNGA LAZYPANDAW PESUTHU </strong>`,
};
sgMail
  .send(msg)
  .then(() => {
    console.log("Email sent");
  })
  .catch((error) => {
    console.error(error);
  });
