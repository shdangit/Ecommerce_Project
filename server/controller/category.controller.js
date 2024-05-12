const asyncHandler = require("express-async-handler");
const categoryModel = require("../model/category.model");

const addCategory = asyncHandler(async (req, res, next) => {
  if (!req.body.title) throw new Error("Category là bắt buộc");
  const category = await categoryModel.create(req.body);
  return res.status(category ? 200 : 400).json({
    success: category ? true : false,
    data: category ? category : "Không thể thêm danh mục",
  });
});

const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await categoryModel.find().select("_id title");
  return res.status(categories ? 200 : 404).json({
    success: categories ? true : false,
    data: categories ? categories : "Không tìm thấy danh mục",
  });
});

const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await categoryModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  return res.status(category ? 200 : 404).json({
    success: category ? true : false,
    data: category ? category : "Không tìm thấy danh mục",
  });
});

const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await categoryModel.findByIdAndDelete(id);
  return res.status(category ? 200 : 404).json({
    success: category ? true : false,
    message: category
      ? `Danh mục ${category.title} đã được xóa`
      : "Không tìm thấy danh mục",
  });
});

module.exports = {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
