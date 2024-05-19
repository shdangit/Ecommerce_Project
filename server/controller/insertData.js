const asyncHandler = require("express-async-handler");
const productModel = require("../model/product.model");
const categoryModel = require("../model/category.model");
const slugify = require("slugify");
const data = require("../../data/ecommerce.json");
const dataCategory = require("../../data/category_brand");

const getProduct = async (product) => {
  await productModel.create({
    title: product?.name,
    slug: slugify(product?.name) + Math.round(Math.random() * 1000) + "",
    description: product?.description + Math.round(Math.random() * 100) + "",
    brand: product?.brand,
    price: Math.round(Number(product?.price.match(/\d/g).join("")) / 100),
    category: product?.category[1],
    quantity: Math.round(Math.random() * 1000),
    sold: Math.round(Math.random() * 100),
    images: product?.images,
    color: product?.variants?.find((element) => element.label === "Color")
      ?.variants[0],
  });
};

const getCategory = async (cate) => {
  await categoryModel.create({
    title: cate?.cate,
    brand: cate?.brand,
  });
};
const insertProduct = asyncHandler(async (req, res, next) => {
  const promises = [];
  for (let product of data) promises.push(getProduct(product));
  await Promise.all(promises);
  return res.status(200).json("Done");
});

const insertCategory = asyncHandler(async (req, res, next) => {
  const promises = [];
  for (let category of dataCategory) promises.push(getCategory(category));
  await Promise.all(promises);
  return res.status(200).json("Done");
});

module.exports = {
  insertProduct,
  insertCategory,
};
