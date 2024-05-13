const asyncHandler = require("express-async-handler");
const brandModel = require("../model/brand.model");

const addBrand = asyncHandler(async (req, res, next) => {
  if (!req.body.title) throw new Error("Brand là bắt buộc");
  const brand = await brandModel.create(req.body);
  return res.status(brand ? 200 : 500).json({
    success: brand ? true : false,
    data: brand ? brand : "Không thể thêm nhãn hiệu",
  });
});

const getBrands = asyncHandler(async (req, res, next) => {
  const categories = await brandModel.find().select("_id title");
  return res.status(categories ? 200 : 404).json({
    success: categories ? true : false,
    data: categories ? categories : "Không tìm thấy nhãn hiệu",
  });
});

const updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await brandModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  return res.status(category ? 200 : 500).json({
    success: category ? true : false,
    data: category ? category : "Không thể cập nhật nhãn hiệu",
  });
});

const deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await brandModel.findByIdAndDelete(id);
  return res.status(category ? 200 : 500).json({
    success: category ? true : false,
    message: category
      ? `Nhãn hiệu ${category.title} đã được xóa`
      : "Không thể xóa nhãn hiệu",
  });
});

module.exports = {
  addBrand,
  getBrands,
  updateBrand,
  deleteBrand,
};
