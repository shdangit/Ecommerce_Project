const data = require("../controller/insertData");
const router = require("express").Router();

router.post("/", data.insertProduct);
router.post("/category", data.insertCategory);
module.exports = router;
