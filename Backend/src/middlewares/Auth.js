const { UserModel } = require("../models");
const ApiError = require("../utils/ApiError");
const catchAsyn = require("../utils/catchAsync");
const jwt = require('jsonwebtoken')

const Auth = catchAsyn(async(req,res,next)=>
{
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    const decodeToken = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET_KEY)
    if(!decodeToken){
        throw ApiError(404,"Uauthorized User")
    }

    const user = await UserModel.findById(decodeToken._id)
    req.user = user
    next()
})


const AuthAdmin = (...roles)=>
{
    return (req,res,next)=>
    {
        if(!roles.includes(req.user.role)){
            return next(
                new ApiError(403,`Role:${req.user.role} is not allowed to access this resouce`)
            )
        }
        next();
    }
}

module.exports = {Auth,AuthAdmin}