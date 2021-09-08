const mongoose = require("mongoose");
const crypto = require("crypto");
const {uuid} = require("uuidv4");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const Hashing = require("./../../utils/hashing");

const userSchema = new Schema(
  {

    userId: {
      type: String,
      // required:[true,'UserId is must!'],
      unique: true
    },
    username: {
      type: String,
      required: [true,'Username is must!'],
      unique: true
    },
    firstname: {
      type: String,
      required: [true,'A user must have a firstname!'],
    },
    lastname: {
      type: String
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true,'A user must provide email!'],
      unique: true
    },
    password: {
      type: String,
      required: [true,'please provide a password!'],
      // select: false
    },
    verified: {
      type:String,
      default: "false"
    },
    verifiedByAdmin: {
      type:String,
      default: "false"
    },
    manualVerification: {
      type:String,
      default: "false"
    },
    addressId: {
      type: String,
      default: "Not Updated"
    },
    contactNumber: {
      type: String,
      required: [true,'please provide your contactnumber!'],
    },
    points: {
        type: Number,
        default: 0
    },
    createdAt: {
      type: Number,
      // required: [true,'createdAt is must!'],
    },
    updatedAt: {
      type: Number,
      default: 0
    },
    userRole:{
      type:String,
      enum: ['buyer', 'seller', 'admin'],
      required:[true,'A user must have a role'],
      default:"buyer"
    },
    verificationToken:{
      type:String
    },
    // passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
    // resetPasswordToken:String,
    token:String,
  },
   
  {
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
    }
);

  userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    this.userId = uuid();
    this.createdAt= moment(Date.now()).unix();
    this.updatedAt= moment(Date.now()).unix();

    // Hash the password with cost of 12
    let salt = await bcrypt.genSaltSync(10)
    let pass = await this.password
    this.password = await bcrypt.hashSync(pass, salt),
    

    next();
});

// userSchema.virtual('wishlist',{
//   ref:'wishlistModel',
//   foreignField:'customerId',
//   localField:'userId'
// });

// userSchema.virtual('cartlist',{
//   ref:'cartlistModel',
//   foreignField:'customerId',
//   localField:'userId'
// });


  

userSchema.methods.createVerificationToken = function () {
  const verifyToken = crypto.randomBytes(32).toString('hex');

  this.verificationToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

  console.log({ verifyToken }, this.verificationToken);

  return verifyToken;
};
// password reset token is Different from verification token
userSchema.methods.createPasswordResetToken =  function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  // const resetToken =  crypto
  // .createHash('sha256')
  // .update("thisisTLmode")
  // .digest('hex');

  // this.passwordResetToken = crypto
  //     .createHash('sha256')
  //     .update(resetToken)
  //     .digest('hex');
//  const  resetToken = "sabarivenkatesh";
  // this.passwordResetToken = Hashing.hash(resetToken, resetToken.length);
  // this.passwordResetToken = resetToken;
  // this.token = resetToken;
  this.token = Hashing.hash(resetToken, resetToken.length);
  console.log({ resetToken }, this.token);
  // console.log(this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// userSchema.virtual('wishListPage', {
//   ref: 'product',
//   foreignField: 'wishListUserId',
//   localField: 'userId'
// });

const User = mongoose.model("user", userSchema);
module.exports = User;
