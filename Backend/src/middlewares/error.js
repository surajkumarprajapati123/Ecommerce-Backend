const ApiError = require('../utils/ApiError');
const catchAsyn = require('../utils/catchAsync')
const MiddelWareError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.msg = err.msg || "Internal Server is Error ";

    res.status(err.statusCode).json({
        success: false,
        error: err.stack
    });

    if(err.name === 'CastError'){
           const message = `Resouce not found Invalid Mongo:${err.path}`
           err =  new ApiError(400,null,message)
           console.log(err)
    }
    if(err.name === 'JsonwebTokenError'){
           const message = 'Json webtoken is invalid try  again'
           err =  new ApiError(400,null,message)
           
    }
    if(err.name === 'TokenExpiredError'){
           const message = 'Json webtoken is Expired try  again'
           err =  new ApiError(400,null,message)
           
    }
    if(err.name === 'TypeError'){
           const message = err.stack
           err =  new ApiError(400,null,message)
           
    }
    
};

module.exports = MiddelWareError;
