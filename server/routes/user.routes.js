const router = require("express").Router();
const user = require("../controller/user.controller");

router.post("/register", user.register);

module.exports = router;
