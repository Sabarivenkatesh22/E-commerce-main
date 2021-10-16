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
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

/************ConfigDatas************/
dotenv.config({path:'../config.env'});

/************DataParsing************/
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use((req,res,next)=>{
    console.log(req.body);
    next();
});

/************CORS*******************/
app.use(cors())

/************GLOBAL MIDDLEWARE*******************/

// SET SECURITY HTTP HEADERS
app.use(helmet());

// FOR LOGGING THE REQUESTS
if(process.env.NODE_ENV !== 'production'){
    app.use(morgan('dev'));
}

// LIMITING THE NUMBER OF REQUESTS
const limiter = rateLimit({
    max:500,
    windowMs:60*60*1000,
    message:"Too many request from the same IP, please try again later!"
});
app.use('/api',limiter);

// LIMITING THE SIZE OF REQ.BODY 
app.use(express.json({limit:'10kb'}));

// DATA SANITIZATION FOR NOSQL QUERIES
app.use(mongoSanitize());

// DATA SANITIZATION AGAINST XSS
app.use(xss());

// / TO ACCESS PUBLIC FILES
app.use(express.static(`${__dirname}/public`));
// app.use('/uploads/product/images', express.static('uploads/product/images'));

/************APIs*******************/
app.use('/api', api)

app.use(globalErrorHandler);


/************SERVER*****************/
let port = process.env.PORT
app.listen(port, () => console.log(`Server is running at PORT ${port}`))
