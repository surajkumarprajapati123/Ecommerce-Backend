const  mongoose = require('mongoose')

const ProductSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Enter the product name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Enter the product description"]
    },
    price:{
        type:Number,
        required:[true,"Enter the product price"],
        maxLength:[8,'Price can not excced 8 charcters']

    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String
            },
            url:{
                type:String
            }
        }
    ],
    category:{
        type:String,
        required:[true,'Please eneter product category']
    },
    stock:{
        type:Number,
        required:[true,'Please eneter product stock'],
        maxLength:[4,'Stock cant exceed 4 character '],
        default:1
    },
    numofRewievs:{
        type:Number,
        default:0

    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'user'
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            Comment:{
                type:String,
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
},{timestamps: true})


const ProductModel = mongoose.model('product',ProductSchema)
module.exports = ProductModel