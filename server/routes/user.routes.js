const router = require("express").Router();
const user = require("../controller/user.controller");
const { verifyAccessToken, isAdmin } = require("../util/verifyToken");

router.post("/register", user.register);
router.post("/login", user.login);
router.get("/get-me", verifyAccessToken, user.getMe);
router.post("/refreshToken", user.refreshAccessToken);
router.post("/logout", verifyAccessToken, user.logout);
router.get("/forgot-password", user.forgotPassword);
router.put("/reset-password", user.resetPassword);
router.put("/update-me", verifyAccessToken, user.updateMe);
router.put("/update-address-me", verifyAccessToken, user.updateAddressMe);
router.put("/update-cart", verifyAccessToken, user.updateCart);

module.exports = router;
