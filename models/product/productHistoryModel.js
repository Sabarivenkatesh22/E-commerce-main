const mongoose = require("mongoose");
//  when user goes for product history tab make 
// post request to this model sending product id ...
const productHistorySchema = new mongoose.Schema({
    productId: [
        {
            type: string
        }
    ],
    title: [{

        from: String,
        to: String,
        updatedAt: Date
    }],
    description: [{

        from: String,
        to: String,
        updatedAt: Date
    }],
    price: [{

        from: String,
        to: Number,
        updatedAt: Date
    }],
    category: [{

        // ref: 'Category',
        from: String,
        to: String,
        updatedAt: Date
    }],
    quantity: [{

        from: Number,
        to: Number,
        updatedAt: Date
    }],
    colour: [{
        type: Object
    }],
    sold: [{

        from: Number,
        to: Number,
        updatedAt: Date
    }],
    customerId: {
        type: string
    }

});

// the result will be of like "from" and "to" type
// "from" field will be from model old product cloned to history model and
// in history model everything will be in array format 
// "to" field from new product model

const productHistoryModel = mongoose.model("productHistoryModel", productHistorySchema);

module.exports = productHistoryModel;