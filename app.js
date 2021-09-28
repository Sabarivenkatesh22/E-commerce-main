const express = require('express')
const app = express()
const api = require('./routes/api');
const mongoose = require('./connection/mongodb')
const globalErrorHandler = require('./controller/errorController');
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path');

/************ConfigDatas************/
dotenv.config();

/************DataParsing************/
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use((req,res,next)=>{
    console.log(req.body);
    next();
});

/************CORS*******************/
app.use(cors())

/************PublicFiles************/
app.use(express.static(`${__dirname}/public`));
// app.use('/uploads/product/images', express.static('uploads/product/images'));

/************APIs*******************/
app.use('/api', api)

app.use(globalErrorHandler);


/************SERVER*****************/
let port = process.env.PORT
app.listen(port, () => console.log(`Server is running at PORT ${port}`))
