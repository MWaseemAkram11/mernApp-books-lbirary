const express = require("express");

const controller = require("../controllers/book.controller");
const router = express.Router();

router.route("/action/:id").put(controller.bookAction);
router.route("/add").post(controller.add);
router.route("/delete/:id").delete(controller.delete);

module.exports = router;
