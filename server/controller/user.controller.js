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
  const result = await userModel.create(req.body);
  return res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = {
  register,
};
