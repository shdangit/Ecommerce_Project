const asyncHandler = require("express-async-handler");
const userModel = require("../model/user.model");
const { signAccessToken, signRefreshToken } = require("../util/jwt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../util/sendEmail");
const crypto = require("crypto");

const register = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
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
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }
  // toObject()
  // findOne trả một instance nên phải dùng toOjacet() để convert sang một plain Object
  const user = await userModel.findOne({ email });
  if (user && (await user.checkPassword(password))) {
    const { role, password, ...isUser } = user.toObject();
    const accessToken = signAccessToken(user._id, role);
    const refreshToken = signRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // {new:true}: trả data sau khi cập nhật
    await userModel.findOneAndUpdate(user._id, { refreshToken }, { new: true });
    return res.status(200).json({
      success: true,
      accessToken,
      data: isUser,
    });
  } else {
    throw new Error("Email or Password invalid");
  }
});

const getUser = asyncHandler(async (req, res, next) => {
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
    return res.status(404).json({
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
    return res.status(404).json({
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
    return res.status(404).json({
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
    return res.status(404).json({
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

module.exports = {
  register,
  login,
  getUser,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
};
