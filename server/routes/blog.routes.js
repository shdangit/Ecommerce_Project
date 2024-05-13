const { verifyAccessToken, isAdmin } = require("../util/verifyToken");
const blog = require("../controller/blog.controller");

const router = require("express").Router();

router.post("/add-blog", verifyAccessToken, isAdmin, blog.addBlog);
router.get("/get-blogs", blog.getBlogs);
router.get("/get-blog/:id", blog.getBlog);
router.put("/update-blog/:id", verifyAccessToken, isAdmin, blog.updateBlog);
router.delete("/delete-blog/:id", verifyAccessToken, isAdmin, blog.deleteBlog);
router.put("/like-blog/:id", verifyAccessToken, blog.likeBlog);
router.put("/dislike-blog/:id", verifyAccessToken, blog.dislikeBlog);

module.exports = router;
