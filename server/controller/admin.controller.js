const asyncHandler = require("express-async-handler");
const userModel = require("../model/user.model");

const getUsers = asyncHandler(async (req, res, next) => {
  const users = await userModel
    .find({})
    .select("-refreshToken -password -role");
  if (!users)
    return res.status(404).json({
      success: false,
      message: "Users not found",
    });
  return res.status(200).json({
    success: true,
    data: users,
  });
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const { _id } = req.query;
  if (!_id) throw new Error("_id invalid");
  const user = await userModel.findByIdAndDelete(_id);
  if (!user)
    return res.status(404).json({
      success: false,
      message: "Users not found",
    });
  return res.status(200).json({
    success: true,
    message: `User with email is ${user.email} deleted`,
  });
});

const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (Object.keys(req.body).length === 0)
    throw new Error("Require value for update");
  const user = await userModel
    .findByIdAndUpdate(id, req.body, { new: true })
    .select("-password -role -refreshToken");
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  return res.status(200).json({
    success: true,
    data: user,
  });
});

module.exports = {
  getUsers,
  deleteUser,
  updateUser,
};
