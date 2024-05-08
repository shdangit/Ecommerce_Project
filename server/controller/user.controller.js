const asyncHandler = require("express-async-handler");
const userModel = require("../model/user.model");

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
    return res.status(200).json({
      success: true,
      data: isUser,
    });
  } else {
    throw new Error("Email or Password invalid");
  }
});
module.exports = {
  register,
  login,
};
