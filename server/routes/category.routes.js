const { verifyAccessToken, isAdmin } = require("../util/verifyToken");
const category = require("../controller/category.controller");

const router = require("express").Router();

router.post("/add-category", verifyAccessToken, isAdmin, category.addCategory);
router.get("/get-categories", category.getCategories);
router.put(
  "/update-category/:id",
  verifyAccessToken,
  isAdmin,
  category.updateCategory
);
router.delete(
  "/delete-category/:id",
  verifyAccessToken,
  isAdmin,
  category.deleteCategory
);

module.exports = router;
