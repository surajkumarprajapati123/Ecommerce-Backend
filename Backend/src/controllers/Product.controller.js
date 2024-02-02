const ProductModel = require("../models/product.model");
const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/ApiFeatures");
const ApiResponse = require("../utils/ApiResponce");
const catchAsyn = require("../utils/catchAsync");

//   create product by admin
const CreateProduct = catchAsyn(async (req, res) => {
  const data = await ProductModel.create(req.body);
  data.user = req.user._id;
  res.json(new ApiResponse(201, data, "Product Created Successfully"));
});

const UpdateProduct = catchAsyn(async (req, res) => {
  const data = await ProductModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(new ApiResponse(201, data, "Product Updated Successfully"));
});

const DeletePtouct = catchAsyn(async (req, res) => {
  // const data = await ProductModel.findByIdAndDelete(req.params.id)
  const data = await ProductModel.findByIdAndDelete(req.params.id);

  if (!data) {
    throw new ApiError(201, "Product not found");
  }
  await data.deleteOne();

  res.json(new ApiResponse(201, "Product Deleted successfully"));
});
const ProductFindByid = catchAsyn(async (req, res) => {
  const data = await ProductModel.findById(req.params.id);
  res.json(new ApiResponse(201, data, "Product Fetched  Successfully"));
});

const getAllProduct = catchAsyn(async (req, res) => {
  const ResultPerPage = 5;
  const productCount = await ProductModel.countDocuments();
  console.log(productCount);
  const apifeature = new ApiFeatures(ProductModel.find(), req.query)
    .search()
    .filter()
    .pagination(ResultPerPage);
  const data = await apifeature.query;
  res.json({
    messafe: "Success",
    data,
    productCount,
  });
});

const CreatePrductReview = catchAsyn(async (req, res) => {
  const { rating, Comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    Comment,
  };
  const product = await ProductModel.findById(productId);

  const isReviewd = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewd) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        (rev.rating = rating), (rev.Comment = Comment);
      }
    });
  } else {
    product.reviews.push(review);
    product.numofRewievs = product.reviews.length;
  }
  let ave = 0;
  product.ratings = product.reviews.forEach((rev) => {
    ave += rev.rating;
  });
  product.ratings = ave / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.json({
    msg: "success",
  });
});

// Get alll produt routes

const getAllproductRating = catchAsyn(async (req, res) => {
  const product = await ProductModel.findById(req.query.id);
  if (!product) {
    new ApiError(404, "Product not found");
  }
  res.json(
    new ApiResponse(
      200,
      { rating: product.ratings },
      "Product Rating  fetched successfully"
    )
  );
});

const DeleteProductRatings = catchAsyn(async (req, res) => {
  const product = await ProductModel.findById(req.query.productid);
  if (!product) {
    new ApiError(404, "Product not found");
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let ave = 0;
  reviews.forEach((rev) => {
    ave += rev.rating;
  });
  const ratings = ave / reviews.length;

  const numofRewievs = reviews.length;

  await ProductModel.findByIdAndUpdate(
    req.query.productid,
    { ratings, reviews, numofRewievs },

    { new: true }
  );

  res.json({
    msg: "Rating is deleted successfully",
  });
});

module.exports = {
  getAllProduct,
  CreateProduct,
  UpdateProduct,
  DeletePtouct,
  ProductFindByid,
  CreatePrductReview,
  getAllproductRating,
  DeleteProductRatings,
};
