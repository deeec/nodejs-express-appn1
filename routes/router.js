//reqとresの引数の入れる箇所は超重要
const express = require("express");
const homeController = require("../controllers/homeController");
const router = express.Router();

//ルートのときはここに来る
//パスに沿ったページをController返す
router.get("/score", homeController.showScore);
router.get("/question", homeController.showQuestion)
router.get("/create", homeController.showCreate)

module.exports = router;
