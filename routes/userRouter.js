let express = require("express");

const router = express.Router();

router.post("/signup", authController.signup);

module.exports = router;
