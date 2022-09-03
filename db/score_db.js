const express = require("express");
const score_db = express();
const score = require("../models/score");//問題のスキーマ

score_db.use(express.json());

//getメソッド
score_db.get("/v1/scores", async(req, res) => {
    try {
        const allScores = await score.find({});
        console.log(allScores);
        res.status(200).json(allScores);
    } catch (err) {
        console.log(err);
    }
});

//postメソッド
score_db.post("/v1/score", async(req, res) => {
    try {
        console.log("score");
        const createScore = await score.create(req.body);
        console.log(createScore);
        res.status(200).json(createScore);
    } catch (err) {
        console.log(err);
    }
});

module.exports = score_db;//questionDBにアクセスするAPIをモジュール化
