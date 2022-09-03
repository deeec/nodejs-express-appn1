const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true, 
    }, 
});

//ミドルウェアとしてエクスポート
module.exports = mongoose.model("question", questionSchema);