

const SendToken = async (user,statusCode,res)=>
{

    const token = await user.GenerateAccessToken();
     const options = {
        expiresIn:Date.now() + process.env.COOKIE_TOKEN_TIME * 24*60*60*1000,
        httpOnly:true

     }
    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        user,
        token
    })
}

module.exports = SendToken