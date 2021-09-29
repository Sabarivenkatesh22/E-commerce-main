const validationerror = require('../middleware/validationError_2');
const env = require('dotenv');
env.config();

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new validationerror(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new validationerror(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new validationerror(message, 400);
};

const handleJWTError = () =>
  new validationerror('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new validationerror('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error : err
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
      // error : err
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);
    console.log("from errorController");
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.log("from development");
    // console.log(err.inner.name);
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // console.log(err.inner['name']);
    console.log("from production");
    let error = { ...err };
    if(err.inner){
      error.name = err.inner['name'] ? err.inner['name'] : error.name;
    }
   
    // error.name = error.name || err.inner['name'];
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
