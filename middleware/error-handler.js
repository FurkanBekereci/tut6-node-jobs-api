const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);

  let customError = {
    statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, try again later!',
  }

  //Catching duplicates
  if(err.code === 11000){
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field(s), please choose another value!!`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  //Catching validation errors
  if(err.name == 'ValidationError'){
    customError.msg = `${Object.values(err.errors).map(e => e.message).join(', ')}`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  //Catching casting error
  if(err.name == 'CastError'){
    customError.msg = `Record with id ${err.value} not found`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }



  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg:customError.msg })
}

module.exports = errorHandlerMiddleware
