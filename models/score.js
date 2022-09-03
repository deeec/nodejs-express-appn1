const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
    score: {
        type: Number,
        require: true,
    },
});

//ミドルウェアとしてエクスポート
module.exports = mongoose.model("score", scoreSchema);