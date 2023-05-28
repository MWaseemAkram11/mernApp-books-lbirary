const express = require("express");
const authRoutes = require("./auth.route");
const bookRoute = require("./book.route")
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/book", bookRoute);

module.exports = router;
