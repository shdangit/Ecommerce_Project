const router = require("express").Router();
const uploadCloud = require("../config/cloudinary.config");
const product = require("../controller/product.controller");
const { verifyAccessToken, isAdmin } = require("../util/verifyToken");

router.post("/add-product", verifyAccessToken, isAdmin, product.addProduct);
router.get("/get-products", verifyAccessToken, isAdmin, product.getProducts);
router.get("/get-product/:id", product.getProduct);
router.put(
  "/update-product/:id",
  verifyAccessToken,
  isAdmin,
  product.updateProduct
);
router.delete(
  "/delete-product/:id",
  verifyAccessToken,
  isAdmin,
  product.deleteProduct
);
router.put(
  "/upload-image/:id",
  verifyAccessToken,
  isAdmin,
  uploadCloud.array("images"),
  product.uploadImageProduct
);
router.put("/rating-product", verifyAccessToken, product.ratings);

module.exports = router;
