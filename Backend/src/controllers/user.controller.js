const { UserModel } = require("../models");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponce");
const catchAsyn = require("../utils/catchAsync");
const sendEmail = require("../utils/sendEmail");
const SendToken = require("../utils/sendToken");
const crypto = require("crypto");

const UserCreate = catchAsyn(async (req, res) => {
  const data = await UserModel.create(req.body);

  res.json(new ApiResponse(201, data, "User Created Successfully"));
});

const UserLogin = catchAsyn(async (req, res) => {
  const { email, password } = req.body;
  // console.log('working one')
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw ApiError(404, "User Not found");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  console.log({ isPasswordValid });
  if (!isPasswordValid) {
    new ApiError(404, "User Not found");
  }
  SendToken(user, 201, res);
});

const UserLogout = catchAsyn(async (req, res) => {
  console.log("Working 1");
  const user = await UserModel.findById(req.user._id);
  if (!user) {
    throw ApiError(404, "Usr not  found");
  }
  const options = {
    expiresIn: Date.now() + process.env.COOKIE_TOKEN_TIME * 24 * 60 * 60 * 1000,
    httpOnly: true,
  };
  res.status(200).cookie("token", "", options).json({
    success: false,
    message: "User logout successfully",
  });
});

const UpdateUser = catchAsyn(async (req, res) => {
  const data = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(new ApiResponse(201, data, "User Updated Successfully"));
});

const UpdateUserPassword = catchAsyn(async (req, res) => {
  const user = await UserModel.findById(req.user._id);
  if (!user) {
    new ApiError(404, "User not found");
  }

  const ismatchedPassword = user.isPasswordCorrect(req.body.oldpassword);
  if (!ismatchedPassword) {
    new ApiError(404, " Old Password does not match");
  }
  user.password = req.body.newPassword;
  await user.save();
  SendToken(user, 201, res);
});

const UserFindByid = catchAsyn(async (req, res) => {
  const data = await UserModel.findById(req.params.id);
  res.json(new ApiResponse(201, data, "User Fetched Successfully"));
});
const DeleteUser = catchAsyn(async (req, res) => {
  // const data = await ProductModel.findByIdAndDelete(req.params.id)
  const data = await UserModel.findByIdAndDelete(req.params.id);

  if (!data) {
    throw new ApiError(201, "Product not found");
  }
  await data.deleteOne();

  res.json(new ApiResponse(201, "User Deleted Successfully"));
});

const FindAllUser = catchAsyn(async (req, res) => {
  const data = await UserModel.find();
  res.json(new ApiResponse(201, data, "User Deleted Successfully"));
});

const ForgatePassword = catchAsyn(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    return next(new ApiError(404, "User not found"));
  }
  const resetToken = user.getResetPassword();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token: \n\n${resetPasswordUrl}\n\nIf you didn't request this, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Ecommerce Password Reset",
      message: message,
    });

    res.json(new ApiResponse(200, user.email, "Email sent successfully"));
  } catch (error) {
    // If there is an error sending the email, handle it and return an error response
    user.resetpasswordtoken = undefined;
    user.resetpasswordexpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ApiError(500, "Error sending the email"));
  }
});

const ResetPassword = catchAsyn(async (req, res, next) => {
  const resetpasswordtoken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await UserModel.findOne({
    resetpasswordtoken,
    resetpasswordexpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError(400, "User not found"));
  }
  if (req.body.password !== req.body.confirmpassword) {
    return next(new ApiError(400, "Password does not  match"));
  }

  user.password = req.body.password;
  user.resetpasswordtoken = undefined;
  user.resetpasswordexpire = undefined;
  await user.save();
  SendToken(user, 200, res);
});

const UpdateUserProfile = catchAsyn(async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await UserModel.findByIdAndUpdate(req.user._id, data, {
    new: true,
  });
  if (!user) {
    new ApiError(404, "User not found");
  }

  res.json(new ApiResponse(201, user, "Profile Updated successfuly"));
});
const UpdateUserRole = catchAsyn(async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await UserModel.findByIdAndUpdate(req.user._id, data, {
    new: true,
  });
  if (!user) {
    new ApiError(404, "User not found");
  }

  res.json(new ApiResponse(201, user, "Profile Updated successfuly"));
});

//  get singal user by admin

const getUserByidandadmin = catchAsyn(async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) {
    new ApiError(404, "User not  found");
  }
  res.json(new ApiResponse(201, user, "User Fetched successfully"));
});

module.exports = {
  UserCreate,
  UpdateUser,
  UserFindByid,
  DeleteUser,
  FindAllUser,
  UserLogin,
  UserLogout,
  ForgatePassword,
  ResetPassword,
  UpdateUserPassword,
  UpdateUserProfile,
  getUserByidandadmin,
  UpdateUserRole,
};
