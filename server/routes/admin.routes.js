const { verifyAccessToken, isAdmin } = require("../util/verifyToken");
const admin = require("../controller/admin.controller");

const router = require("express").Router();

router.get("/get-users", verifyAccessToken, isAdmin, admin.getUsers);
router.delete("/delete-user", verifyAccessToken, isAdmin, admin.deleteUser);
router.put("/update-user/:id", verifyAccessToken, isAdmin, admin.updateUser);

module.exports = router;
