const asyncHandler = require("express-async-handler");
const couponModel = require("../model/coupon.model");

const addCoupon = asyncHandler(async (req, res, next) => {
  const { name, discount, expire } = req.body;
  if (!name || !discount || !expire)
    throw new Error("Thông tin coupon là bắt buộc");
  const coupon = await couponModel.create({
    ...req.body,
    expire: Date.now() + +expire * 24 * 60 * 60 * 1000,
  });
  return res.status(coupon ? 200 : 500).json({
    success: coupon ? true : false,
    data: coupon ? coupon : "Không thể thêm coupon",
  });
});

const getCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await couponModel.find().select("-createdAt -updatedAt");
  return res.status(coupons ? 200 : 404).json({
    success: coupons ? true : false,
    data: coupons ? coupons : "Không tìm thấy coupons",
  });
});

const updateCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (Object.keys(req.body).length === 0)
    throw new Error("Thông tin coupon là bắt buộc");
  if (req.body.expire)
    req.body.expire = Date.now() + +req.body.expire * 24 * 60 * 60 * 1000;
  const coupon = await couponModel
    .findByIdAndUpdate(id, req.body, {
      new: true,
    })
    .select("-createdAt -updatedAt");
  return res.status(coupon ? 200 : 500).json({
    success: coupon ? true : false,
    data: coupon ? coupon : "Không thể cập nhật coupon",
  });
});

const deleteCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await couponModel.findByIdAndDelete(id);

  return res.status(coupon ? 200 : 500).json({
    success: coupon ? true : false,
    data: coupon
      ? `Mã giảm giá ${coupon.name} đã được xóa`
      : "Không thể xóa coupon",
  });
});
module.exports = {
  addCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
};
