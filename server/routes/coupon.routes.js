const { verifyAccessToken, isAdmin } = require("../util/verifyToken");
const coupon = require("../controller/coupon.controller");

const router = require("express").Router();

router.post("/add-coupon", verifyAccessToken, isAdmin, coupon.addCoupon);
router.get("/get-coupons", coupon.getCoupons);
router.put(
  "/update-coupon/:id",
  verifyAccessToken,
  isAdmin,
  coupon.updateCoupon
);
router.delete(
  "/delete-coupon/:id",
  verifyAccessToken,
  isAdmin,
  coupon.deleteCoupon
);

module.exports = router;
