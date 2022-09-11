//ルートのときはここに来る
exports.showTop = (req, res) => {
    res.render("index");
};

//ルートのときはここに来る
exports.showQuestion = (req, res) => {
    res.render("question");
};

//ルートのときはここに来る
exports.showScore = (req, res) => {
    res.render("score");
};

//ルートのときはここに来る
exports.showCreate = (req, res) => {
    res.render("create");
};

//ルートのときはここに来る
exports.showQuestionDev = (req, res) => {
    res.render("questionDev");
};

