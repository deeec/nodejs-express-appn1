const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
    score: {
        type: Number,
        require: true,
    },
    examDate: {
        type: String,
    },
});

//ミドルウェアとしてエクスポート
module.exports = mongoose.model("score", scoreSchema);