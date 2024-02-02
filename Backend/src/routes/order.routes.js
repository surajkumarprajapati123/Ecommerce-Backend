const express = require("express");
const { OrderController } = require("../controllers");
const { AuthAdmin, Auth } = require("../middlewares/Auth");
const router = express.Router();

router.route("/create").post(OrderController.CrateOrder);

router
  .route("/admin/orderid/:id")
  .patch(Auth, AuthAdmin("admin"), OrderController.UpdateOrderAdmin)
  .delete(Auth, AuthAdmin("admin"), OrderController.DeleteOrderAdmin);

router
  .route("/all")
  .get(Auth, AuthAdmin("admin"), OrderController.getOrderById)
  .get(Auth, OrderController.getLoginOrder);
module.exports = router;
