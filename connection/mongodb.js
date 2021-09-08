let mongoose = require("mongoose");
mongoose.Promise = global.Promise;

require('dotenv').config({ path: '.env' }); 

const mongoConnection = process.env.DATABASE_CONNECT

mongoose.connect(
  mongoConnection,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  err => {
    if (err) console.log(err);
    else console.log("MongoDB Connected");
  }
);
module.exports = { mongoose };
