const { verifyAccessToken, isAdmin } = require("../util/verifyToken");
const brand = require("../controller/brand.controller");

const router = require("express").Router();

router.post("/add-brand", verifyAccessToken, isAdmin, brand.addBrand);
router.get("/get-brands", brand.getBrands);
router.put("/update-brand/:id", verifyAccessToken, isAdmin, brand.updateBrand);
router.delete(
  "/delete-brand/:id",
  verifyAccessToken,
  isAdmin,
  brand.deleteBrand
);

module.exports = router;
