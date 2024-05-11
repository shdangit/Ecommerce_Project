const router = require("express").Router();
const proudct = require("../controller/product.controller");
const { verifyAccessToken, isAdmin } = require("../util/verifyToken");

router.post("/add-product", verifyAccessToken, isAdmin, proudct.addProduct);
router.get("/get-products", verifyAccessToken, isAdmin, proudct.getProducts);
router.get("/get-product/:id", proudct.getProduct);
router.put(
  "/update-product/:id",
  verifyAccessToken,
  isAdmin,
  proudct.updateProduct
);
router.delete(
  "/delete-product/:id",
  verifyAccessToken,
  isAdmin,
  proudct.deleteProduct
);

module.exports = router;
