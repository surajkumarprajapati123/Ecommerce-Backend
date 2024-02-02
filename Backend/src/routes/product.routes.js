const express = require("express");
const { ProductController, UserController } = require("../controllers");
const { Auth, AuthAdmin } = require("../middlewares/Auth");
const router = express.Router();

router
  .route("/admin/create")
  .post(Auth, AuthAdmin("admin"), ProductController.CreateProduct);
router
  .route("/admin/productid/:id")

  .delete(Auth, AuthAdmin("admin"), ProductController.DeletePtouct)

  .patch(Auth, AuthAdmin("admin"), ProductController.UpdateProduct);

router.route("/productid/:id").get(ProductController.ProductFindByid);

router
  .route("/rating")
  .post(Auth, ProductController.CreatePrductReview)
  .get(ProductController.getAllproductRating)
  .delete(Auth, ProductController.DeleteProductRatings);

router.route("/all").get(ProductController.getAllProduct);

module.exports = router;
