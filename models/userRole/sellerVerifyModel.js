const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({

    contactNumber:{
        type:"string",
        enum:["verified","not verified"],
        default:"not verified",
        required:["true","contactNumber should be verified"]
    },

    addressId:{
        type:"string",
        enum:["verified","not verified"],
        default:"not verified",
        required:["true","addressId should be verified"]
    },

    verifiedBy:{
        type:"string",
    }


});

const sellerVerifyModel = mongoose.model("sellerVerifyModel",sellerSchema);

module.exports = sellerVerifyModel;