const { OrderModel, ProductModel } = require("../models");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponce");
const catchAsyn = require("../utils/catchAsync");

const CrateOrder = catchAsyn(async(req,res)=>
{
    const order = await OrderModel.create(req.body)
    res.json(new ApiResponse(200,order,"Order Created Successfully"))
})

const getOrderById = catchAsyn(async(req,res)=>
{
    const order = await OrderModel.findById(req.query.id).populate('user','name email')
    if(!order){
        new ApiError(404,"User Not found")
    }
    res.json(new ApiResponse(200,order,"Order fetched susscssfuly"))
})
const getLoginOrder = catchAsyn(async(req,res)=>
{
    const order = await OrderModel.find({user:req.user._id})
    if(!order){
        new ApiError(404,"User Not found")
    }
    res.json(new ApiResponse(200,order,"Order fetched susscssfuly"))
})
//  admin
const getallOrderAdmin = catchAsyn(async(req,res)=>
{
    const orders = await OrderModel.find()
    
    let totalPrice = 0
    orders.forEach(order => {
        totalPrice+=order.totalprice
    });
    res.json({
        order:orders,
        TotalAmount:totalPrice,
        success:true
    })
})

//  admin
const UpdateOrderAdmin = catchAsyn(async(req,res)=>
{
    const order = await OrderModel.findById(req.params.id)

    if(order.OrderStatus = 'Delivered'){
        new ApiError(400,"You have already this order")
    }

    order.OrderItem.forEach(async(order)=>
    {
        await updateStock(order.product,order.Quantity)
    })
   order.OrderStatus = req.body.status

   if(req.body.status == 'Delivered'){
    order.deliveredAt= Date.now()
   }
   await order.save({validateBeforeSave:false})

    res.json(new ApiResponse(200,order,"Order Updated successfully"))
})

async function updateStock(id,Quantity){
     const product = await ProductModel.findById(id)
     product.stock-= Quantity
     await product.save({validateBeforeSave:false})
    
}

//  order Delete by admin

const DeleteOrderAdmin = catchAsyn(async(req,res)=>
{
    const order = await OrderModel.findById(req.params.id)
    if(!order){
        new ApiError(404,"User Not found")
    }
    res.json(new ApiResponse(200,order,"Order fetched susscssfuly"))
    
    
})



module.exports = {
    getallOrderAdmin,
    UpdateOrderAdmin,
    DeleteOrderAdmin,
    CrateOrder,
    getOrderById,
    getLoginOrder
}