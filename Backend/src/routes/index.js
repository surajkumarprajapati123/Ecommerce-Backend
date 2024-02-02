const express = require('express')
const router = express.Router()

const ProductRoutes = require("./product.routes")
const UserRoutes = require('./user.routes')
const OrderRoutes = require('./order.routes')


const Allroutes = [
   
    
    {
         route:"/product",
         routes:ProductRoutes
    },
    {
         route:'/user',
         routes:UserRoutes
    },
    {
          route:"/order",
          routes:OrderRoutes
    }

   
    
        
    
]

Allroutes.forEach((data)=>
{
    router.use(data.route,data.routes)
})

module.exports = router