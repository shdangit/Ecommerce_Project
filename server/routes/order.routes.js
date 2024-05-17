const { verifyAccessToken, isAdmin } = require("../util/verifyToken");
const order = require("../controller/order.controller");

const router = require("express").Router();

router.post("/add-order", verifyAccessToken, order.addOrder);
router.put(
  "/update-status-order/:id",
  verifyAccessToken,
  isAdmin,
  order.updateStatusOrder
);
router.get("/get-order", verifyAccessToken, order.getOrder);
router.get("/get-orders", verifyAccessToken, isAdmin, order.getOrders);

module.exports = router;
