const express = require("express");
const question_db = express();
const question = require("../models/question");//問題のスキーマ

question_db.use(express.json());

//getメソッド
question_db.get("/v1/questions", async(req, res) => {
    try {
        const allQuestions = await question.find({});
        //console.log(allQuestions);
        res.status(200).json(allQuestions);
    } catch (err) {
        console.log(err);
    }
});

//postメソッド
question_db.post("/v1/question", async(req, res) => {
    try {
        const createQuestion = await question.create(req.body);
        res.status(200).json(createQuestion);
    } catch (err) {
        console.log(err);
    }
});

//deleteメソッド
question_db.delete("/v1/:id", async(req, res) => {
    try {
        await question.findByIdAndDelete(req.params.id);
        res.status(200);
    } catch (err) {
        console.log(err);
    }
});

//updatePatchメソッド
question_db.patch("/v1/upd/:id", async(req, res) => {
    try {
        await question.findByIdAndUpdate(req.params.id, req.body);
        res.status(200);
    } catch (err) {
        console.log(err);
    }
});

module.exports = question_db;//questionDBにアクセスするAPIをモジュール化
