const router = require("express").Router();
const user = require("../controller/user.controller");
const { verifyAccessToken } = require("../util/verifyToken");

router.post("/register", user.register);
router.post("/login", user.login);
router.get("/getUser", verifyAccessToken, user.getUser);
router.post("/refreshToken", user.refreshAccessToken);
router.post("/logout", verifyAccessToken, user.logout);

module.exports = router;
