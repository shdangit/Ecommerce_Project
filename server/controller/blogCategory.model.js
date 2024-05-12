const asyncHandler = require("express-async-handler");
const blogCategoryModel = require("../model/blogCategory.model");

const addBlogCategory = asyncHandler(async (req, res, next) => {
  if (!req.body.title) throw new Error("Blog category là bắt buộc");
  const blogCategory = await blogCategoryModel.create(req.body);
  return res.status(blogCategory ? 200 : 400).json({
    success: blogCategory ? true : false,
    data: blogCategory ? blogCategory : "Không thể thêm danh mục cho blog",
  });
});

const getBlogCategories = asyncHandler(async (req, res, next) => {
  const blogCategories = await blogCategoryModel.find().select("_id title");
  return res.status(blogCategories ? 200 : 404).json({
    success: blogCategories ? true : false,
    data: blogCategories ? blogCategories : "Không tìm thấy danh mục blog",
  });
});

const updateBlogCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const blogCategory = await blogCategoryModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  return res.status(blogCategory ? 200 : 404).json({
    success: blogCategory ? true : false,
    data: blogCategory ? blogCategory : "Không tìm thấy danh mục cho blog",
  });
});

const deleteBlogCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const blogCategory = await blogCategoryModel.findByIdAndDelete(id);
  return res.status(blogCategory ? 200 : 404).json({
    success: blogCategory ? true : false,
    message: blogCategory
      ? `Danh mục ${blogCategory.title} của blog đã được xóa`
      : "Không tìm thấy danh mục cho blog",
  });
});

module.exports = {
  addBlogCategory,
  getBlogCategories,
  updateBlogCategory,
  deleteBlogCategory,
};
