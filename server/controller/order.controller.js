const asyncHandler = require("express-async-handler");
const orderModel = require("../model/order.model");
const userModel = require("../model/user.model");
const couponModel = require("../model/coupon.model");

const addOrder = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { coupon } = req.body;
  const userCart = await userModel
    .findById(_id)
    .select("cart")
    .populate("cart.product", "title price");

  const products = userCart?.cart?.map((element) => ({
    product: element.product._id,
    count: element.quantity,
    color: element.color,
  }));
  let total = userCart?.cart?.reduce(
    (sum, element) => sum + element.quantity * element.product.price,
    0
  );
  const infoOrder = { products, total, orderBy: _id };
  if (coupon) {
    const infoCoupon = await couponModel.findById(coupon);
    total =
      Math.round((total * (1 - infoCoupon.discount / 100)) / 1000) * 1000 ||
      total;
    infoOrder.total = total;
    infoOrder.coupon = coupon;
  }

  const order = await orderModel.create(infoOrder);
  return res.status(order ? 200 : 400).json({
    success: order ? true : false,
    data: order ? order : "Không có đơn hàng nào",
  });
});

const updateStatusOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) throw new Error("Thông tin status là bắt buộc");

  const order = await orderModel.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  return res.status(order ? 200 : 400).json({
    success: order ? true : false,
    data: order ? order : "Không thể cập nhật trạng thái đơn hàng",
  });
});

const getOrder = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;

  const order = await orderModel.find({ orderBy: _id });
  return res.status(order ? 200 : 404).json({
    success: order ? true : false,
    data: order ? order : "Không thể lấy đơn hàng",
  });
});

const getOrders = asyncHandler(async (req, res, next) => {
  const orders = await orderModel.find();
  return res.status(orders ? 200 : 404).json({
    success: orders ? true : false,
    data: orders ? orders : "Không thể lấy đơn hàng",
  });
});

module.exports = {
  addOrder,
  updateStatusOrder,
  getOrder,
  getOrders,
};
