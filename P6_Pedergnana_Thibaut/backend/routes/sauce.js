const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controllers/sauce");
const multer = require("../middlewares/multer-config");

router.get("/", sauceCtrl.getAll);
router.get("/:id", sauceCtrl.getOne);
router.post("/", multer, sauceCtrl.create);
router.put("/:id", sauceCtrl.edit);
router.delete("/:id", sauceCtrl.remove);
router.post("/:id/likes", sauceCtrl.like);

module.exports = router;
