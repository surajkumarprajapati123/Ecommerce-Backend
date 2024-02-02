const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const UserSchema =  mongoose.Schema({
   name:{
    type:String,
    required:[true,"Please Enter the name"],
    maxLength:[10,"Name Can not Exceed 10 character"],
    minLength:[4,"Name atleast 4  character"]
   },
   email:{
    type:String,
    required:[true,"Please Enter the email"],
    unique:true,
    validate:[validator.isEmail,'Please Entert he valid email']
   },
   email:{
    type:String,
    required:[true,"Please Enter the password"]
   },
   password:{
    type:String,
    required:[true,"Please Enter the password"],

   },
   avatar:
    {
        public_id:{
            type:String
        },
        url:{
            type:String
        }
    },
    role:{
        type:String,
        default:'user'
    },

    resetpasswordtoken:String,
    resetpasswordexpire:Date
   
},
{timestamps: true})

UserSchema.pre('save', async function(next)
{
    if(!this.isModified("password")){
        next();
    }
      this.password = await bcrypt.hash(this.password,10)
})
UserSchema.methods.isPasswordCorrect = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password)
}

//  Reset  Password Token

UserSchema.methods.getResetPassword = function() {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetpasswordtoken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetpasswordexpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken;
};

//  Token Generating

UserSchema.methods.GenerateAccessToken =  async function(){
  
     return jwt.sign({
        _id:this._id,
        email:this.email
     },
     process.env.ACCESS_TOKEN_SECRET_KEY,{
        expiresIn:process.env.ACCESS_TOKEN_TIME
     }
     )
}
UserSchema.methods.GenerateRefreshToken =  async function(){
  
     return jwt.sign({
        _id:this._id,
     },
     process.env.REFRESH_TOKEN_SECRET_KEY,{
        expiresIn:process.env.REFRESH_TOKEN_TIME
     }
     )
}

const User = mongoose.model('user',UserSchema)
module.exports = User