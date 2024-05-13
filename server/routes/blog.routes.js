const { verifyAccessToken, isAdmin } = require("../util/verifyToken");
const blog = require("../controller/blog.controller");
const uploadCloud = require("../config/cloudinary.config");

const router = require("express").Router();

router.post("/add-blog", verifyAccessToken, isAdmin, blog.addBlog);
router.get("/get-blogs", blog.getBlogs);
router.get("/get-blog/:id", blog.getBlog);
router.put("/update-blog/:id", verifyAccessToken, isAdmin, blog.updateBlog);
router.delete("/delete-blog/:id", verifyAccessToken, isAdmin, blog.deleteBlog);
router.put("/like-blog/:id", verifyAccessToken, blog.likeBlog);
router.put("/dislike-blog/:id", verifyAccessToken, blog.dislikeBlog);
router.put(
  "/upload-image/:id",
  verifyAccessToken,
  isAdmin,
  uploadCloud.single("image"),
  blog.uploadImageBlog
);

module.exports = router;
