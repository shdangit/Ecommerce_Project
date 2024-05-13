const asyncHandler = require("express-async-handler");
const productModel = require("../model/product.model");
const slugify = require("slugify");

const addProduct = asyncHandler(async (req, res, next) => {
  if (Object.keys(req.body).length === 0)
    throw new Error("Thông tin sản phẩm là bắt buộc");
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const newProduct = await productModel.create(req.body);
  return res.status(newProduct ? 200 : 500).json({
    success: newProduct ? true : false,
    data: newProduct ? newProduct : "Không thể thêm sản phẩm mới",
  });
});

const getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel.findById(id);
  return res.status(product ? 200 : 404).json({
    success: product ? true : false,
    data: product ? product : "Không tìm thấy sản phẩm",
  });
});

const getProducts = asyncHandler(async (req, res, next) => {
  try {
    const queries = { ...req.query };
    //  Tách các trường ra khỏi query
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queries[el]);

    //  Thêm $ trước các giá trị so sánh
    //   Chuyển về stringify vì ở một dạng đối tượng {name:'Hai Dang'} không thể chỉnh sửa được
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    const formatQueries = JSON.parse(queryString);

    //   filtering
    if (queries?.title)
      formatQueries.title = { $regex: queries.title, $options: "i" };
    let queryCommand = productModel.find(formatQueries);

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      queryCommand = queryCommand.sort(sortBy);
    } else {
      queryCommand = queryCommand.sort("-createdAt");
    }

    // Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      queryCommand = queryCommand.select(fields);
    } else {
      queryCommand = queryCommand.select("-__v");
    }

    // 4) Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 4;
    const skip = (page - 1) * limit;

    queryCommand = queryCommand.skip(skip).limit(limit);

    //   Excute
    const response = await queryCommand;
    const counts = await productModel.find(formatQueries).countDocuments();

    return res.status(200).json({
      success: true,
      data: response,
      count: counts,
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const product = await productModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  return res.status(product ? 200 : 500).json({
    success: product ? true : false,
    data: product ? product : "Không thể cập nhật sản phẩm",
  });
});

const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel.findByIdAndDelete(id);
  return res.status(product ? 200 : 500).json({
    success: product ? true : false,
    data: product ? `${product.title} is deleted` : "Không thể xóa sản phẩm",
  });
});

const ratings = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { product_id, star, comment } = req.body;
  if (!product_id || !star)
    throw new Error("Thông tin đánh giá không được để trống");
  const product = await productModel.findById(product_id);
  if (!product)
    return res.status(404).json({
      success: false,
      message: "Không tìm thấy sản phẩm",
    });
  const rater = product.ratings.find(
    (element) => element.postedBy.toString() === _id
  );

  if (rater) {
    await productModel.findOneAndUpdate(
      {
        ratings: { $elemMatch: rater },
      },
      {
        $set: { "ratings.$.star:": star, "ratings.$.comment": comment },
      },
      {
        new: true,
      }
    );
  } else {
    await productModel.findByIdAndUpdate(
      product_id,
      {
        $push: { ratings: { star, comment, postedBy: _id } },
      },
      { new: true }
    );
  }

  // totalRatings
  const sumRater = product.ratings.length;
  const sumRatings = product.ratings.reduce(
    (sum, element) => sum + element.star,
    0
  );
  product.totalRatings = Math.round((sumRatings * 10) / sumRater) / 10;
  product.save();

  return res.status(200).json({
    success: true,
    data: product,
  });
});

module.exports = {
  addProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  ratings,
};
