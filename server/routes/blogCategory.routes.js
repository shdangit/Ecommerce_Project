const { verifyAccessToken, isAdmin } = require("../util/verifyToken");
const blogCategory = require("../controller/blogCategory.model");

const router = require("express").Router();

router.post(
  "/add-blogCategory",
  verifyAccessToken,
  isAdmin,
  blogCategory.addBlogCategory
);
router.get("/get-blogCategories", blogCategory.getBlogCategories);
router.put(
  "/update-blogCategory/:id",
  verifyAccessToken,
  isAdmin,
  blogCategory.updateBlogCategory
);
router.delete(
  "/delete-blogCategory/:id",
  verifyAccessToken,
  isAdmin,
  blogCategory.deleteBlogCategory
);

module.exports = router;
