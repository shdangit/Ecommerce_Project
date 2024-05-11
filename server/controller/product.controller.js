const asyncHandler = require("express-async-handler");
const productModel = require("../model/product.model");
const slugify = require("slugify");

const addProduct = asyncHandler(async (req, res, next) => {
  if (Object.keys(req.body).length === 0) throw new Error("Product require");
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const newProduct = await productModel.create(req.body);
  return res.status(newProduct ? 200 : 400).json({
    success: newProduct ? true : false,
    data: newProduct ? newProduct : "Can not add new product",
  });
});

const getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel.findById(id);
  return res.status(product ? 200 : 404).json({
    success: product ? true : false,
    data: product ? product : "Product not found",
  });
});

const getProducts = asyncHandler(async (req, res, next) => {
  const products = await productModel.find();
  return res.status(products ? 200 : 404).json({
    success: products ? true : false,
    data: products ? products : "Products not found",
  });
});

const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const product = await productModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  return res.status(product ? 200 : 404).json({
    success: product ? true : false,
    data: product ? product : "Product not found",
  });
});

const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel.findByIdAndDelete(id);
  return res.status(product ? 200 : 404).json({
    success: product ? true : false,
    data: product ? `${product.title} is deleted` : "Product not found",
  });
});
module.exports = {
  addProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
