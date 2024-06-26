const asyncHandler = require("express-async-handler");
const userModel = require("../model/user.model");
const { signAccessToken, signRefreshToken } = require("../util/jwt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../util/sendEmail");
const crypto = require("crypto");

const register = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({
      success: false,
      message: "Email and password are required",
    });
  }
  const user = await userModel.findOne({ email });
  if (user) {
    throw new Error("User has existed");
  } else {
    const result = await userModel.create(req.body);
    return res.status(200).json({
      success: result ? true : false,
      message: result
        ? "Register success. Let is login, please"
        : "Have something wrong",
    });
  }
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({
      success: false,
      message: "Email and password are required",
    });
  }
  // toObject()
  // findOne trả một instance nên phải dùng toOjacet() để convert sang một plain Object
  const user = await userModel.findOne({ email });
  if (user && (await user.checkPassword(password))) {
    const { role, password, refreshToken, ...isUser } = user.toObject();
    const accessToken = signAccessToken(user._id, role);
    const newRefreshToken = signRefreshToken(user._id);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // {new:true}: trả data sau khi cập nhật
    await userModel.findOneAndUpdate(
      user._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      accessToken,
      data: isUser,
    });
  } else {
    throw new Error("Email or Password invalid");
  }
});

const getMe = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const user = await userModel
    .findById(_id)
    .select("-refreshToken -password -role");
  if (user) {
    return res.status(200).json({
      success: true,
      data: user,
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const cookie = req.cookies;
  if (cookie && cookie.refreshToken) {
    const refreshToken = cookie.refreshToken;
    jwt.verify(
      refreshToken,
      process.env.JWT_SECRETKEY,
      async (error, decode) => {
        if (error) {
          return res.status(401).json({
            success: false,
            message: "RefreshToken invalid",
          });
        }
        const user = await userModel.findOne({ _id: decode._id, refreshToken });
        return res.status(200).json({
          success: user ? true : false,
          data: user
            ? signAccessToken(user._id, user.role)
            : "Refresh token is not matched",
        });
      }
    );
  } else {
    return res.status(401).json({
      success: false,
      message: "RefreshToken require",
    });
  }
});

const logout = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const user = await userModel.findById(_id);
  if (user) {
    const cookie = req.cookies;
    if (cookie && cookie.refreshToken) {
      const refreshToken = cookie.refreshToken;
      await userModel.findOneAndUpdate(
        { refreshToken },
        { refreshToken: "" },
        { new: true }
      );
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.status(200).json({
        success: true,
        message: "Logout success",
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.query;
  if (!email) throw new Error("Missing email");
  const user = await userModel.findOne({ email });
  if (user) {
    const passwordToken = user.createPasswordChangeToken();
    await user.save();

    const html = `Xin hãy click vào link để thay đổi mật khẩu của bạn <a href="${process.env.DB_URL}/api/user/reset-password/${passwordToken}">Click</a>`;
    const result = await sendEmail(email, html);
    return res.status(200).json({
      success: true,
      result,
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { token, password } = req.body;
  if (!token || !password)
    throw new Error("Password token or password invalid");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await userModel.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangeAt = Date.now();
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    message: user ? "Update password success" : "Error update assword",
  });
});

const updateMe = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  if (!_id || Object.keys(req.body).length === 0)
    throw new Error("Require value for update");
  const user = await userModel
    .findByIdAndUpdate(_id, req.body, { new: true })
    .select("-password -role -refreshToken");
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }
  return res.status(200).json({
    success: true,
    data: user,
  });
});

const updateAddressMe = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  if (!req.body.address) throw new Error("Thông tin điạ chỉ là bắt buộc");
  const user = await userModel
    .findByIdAndUpdate(
      _id,
      { $push: { address: req.body.address } },
      { new: true }
    )
    .select("-password -role -refreshToken");
  return res.status(user ? 200 : 500).json({
    success: user ? true : false,
    data: user ? user : "Không thể cập nhật địa chỉ cho user",
  });
});

const updateCart = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { id, quantity, color } = req.body;
  if (!id || !quantity || !color)
    throw new Error("Thông tin giỏ hàng là bắt buộc");

  const user = await userModel.findById(_id);
  const carted = user?.cart.filter(
    (element) => element.product.toString() === id
  );

  if (carted.length > 0) {
    const isDifferentColor = carted.find((element) => element.color === color);

    if (isDifferentColor) {
      const totalQuantity = isDifferentColor.quantity + quantity;
      const cart = await userModel.updateOne(
        { cart: { $elemMatch: isDifferentColor } },
        { $set: { "cart.$.quantity": totalQuantity } },
        { new: true }
      );
      return res.status(cart ? 200 : 500).json({
        success: cart ? true : false,
        data: cart ? cart : "Không thể cập nhật giỏ hàng",
      });
    } else {
      const cart = await userModel.findByIdAndUpdate(
        _id,
        { $push: { cart: { product: id, quantity, color } } },
        { new: true }
      );
      return res.status(cart ? 200 : 500).json({
        success: cart ? true : false,
        data: cart ? cart : "Không thể cập nhật giỏ hàng",
      });
    }
  } else {
    const cart = await userModel.findByIdAndUpdate(
      _id,
      { $push: { cart: { product: id, quantity, color } } },
      { new: true }
    );

    return res.status(cart ? 200 : 500).json({
      success: cart ? true : false,
      data: cart ? cart : "Không thể cập nhật giỏ hàng",
    });
  }
});
module.exports = {
  register,
  login,
  getMe,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  updateMe,
  updateAddressMe,
  updateCart,
};
