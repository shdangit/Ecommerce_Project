const asyncHandler = require("express-async-handler");
const blogModel = require("../model/blog.model");

const addBlog = asyncHandler(async (req, res, next) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category)
    throw new Error("Thông tin blog là bắt buộc");
  const blog = await blogModel.create(req.body);
  return res.status(blog ? 200 : 400).json({
    success: blog ? true : false,
    data: blog ? blog : "Không thể thêm blog",
  });
});

const getBlogs = asyncHandler(async (req, res, next) => {
  const blogs = await blogModel.find();
  return res.status(blogs ? 200 : 404).json({
    success: blogs ? true : false,
    data: blogs ? blogs : "Không tìm thấy blogs",
  });
});

const getBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const blog = await blogModel
    .findByIdAndUpdate(id, { $inc: { numberViews: 1 } }, { new: true })
    .populate("likes", "email name")
    .populate("dislikes", "email name");
  return res.status(blog ? 200 : 404).json({
    success: blog ? true : false,
    data: blog ? blog : "Không tìm thấy blog",
  });
});

const updateBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (Object.keys(req.body).length === 0)
    throw new Error("Thông tin blog là bắt buộc");
  const blog = await blogModel.findByIdAndUpdate(id, req.body, { new: true });
  return res.status(blog ? 200 : 500).json({
    success: blog ? true : false,
    data: blog ? blog : "Không thể cập nhật blog",
  });
});

const deleteBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const blog = await blogModel.findByIdAndDelete(id);
  return res.status(blog ? 200 : 500).json({
    success: blog ? true : false,
    data: blog
      ? `Blog có title ${blog.title} đã được xóa`
      : "Không thể xóa blog",
  });
});
// like: Nếu đã like thì xóa id user ra khỏi like ngược lại chưa like sẽ thêm id user vào likes
// dislike: Nếu đã dislike thì xóa id user ra khỏi dislike ngược lại chưa dislike sẽ thêm id user vào dislike
const likeBlog = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { id } = req.params;

  const blog = await blogModel.findById(id);
  if (!blog) throw new Eroror("Blog không tồn tại");

  const disliker = blog.dislikes.find((element) => element.toString() === _id);
  if (disliker) {
    await blogModel.findByIdAndUpdate(
      id,
      { $pull: { dislikes: _id } },
      { new: true }
    );
  }

  const liker = blog.likes.find((element) => element.toString() === _id);
  if (liker) {
    const blog = await blogModel.findByIdAndUpdate(
      id,
      { $pull: { likes: _id } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      data: blog,
    });
  } else {
    const blog = await blogModel.findByIdAndUpdate(
      id,
      { $push: { likes: _id } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      data: blog,
    });
  }
});

const dislikeBlog = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { id } = req.params;

  const blog = await blogModel.findById(id);
  if (!blog) throw new Eroror("Blog không tồn tại");

  const liker = blog.likes.find((element) => element.toString() === _id);
  if (liker) {
    await blogModel.findByIdAndUpdate(
      id,
      { $pull: { likes: _id } },
      { new: true }
    );
  }

  const disliker = blog.dislikes.find((element) => element.toString() === _id);
  if (disliker) {
    const blog = await blogModel.findByIdAndUpdate(
      id,
      { $pull: { dislikes: _id } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      data: blog,
    });
  } else {
    const blog = await blogModel.findByIdAndUpdate(
      id,
      { $push: { dislikes: _id } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      data: blog,
    });
  }
});

module.exports = {
  addBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog,
};
