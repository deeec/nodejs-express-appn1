//reqとresの引数の入れる箇所は超重要
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("ユーザーです！");
});

router.get("/info", (req, res) => {
    res.send("ユーザー情報です！");
})

router.get("/:id", (req, res) => {
    res.send(`${req.params.id}のユーザです`);
});

//ミドルウェアとしてエクスポートする
module.exports = router;