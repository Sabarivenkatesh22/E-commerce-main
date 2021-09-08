const mongoose = require("mongoose");

const userHistorySchema = new mongoose.Schema({
    
    username: {
        type: String,
      },

    customerId:{
        type:string
    }  

});


const userHistoryModel = mongoose.model("userHistoryModel",userHistorySchema);

module.exports = userHistoryModel;