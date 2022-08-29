const express = require("express");
const app = express();

//user系のルータをインポート
const userRouter = require("./routes/user");

//app.use(express.static("public"));
//テンプレートエンジン
app.set("view engine", "ejs");

//ルーティング処理をここに記載
//userのエントリポイントに関してはuserRouterに任せる
app.use("/user", userRouter);

//myloggernoの使用宣言：ミドルウェアは一番上で宣言
//本来は認証情報などを扱う
app.use(mylogger);

//エントリポイント
app.get("/", (req, res) => {
    res.render("index", {text: "textとhtml"});
});

//ミドルウェア
function mylogger(req, res, next){
    console.log(req.originalUrl);
    next();
}

app.listen(process.env.PORT || 3000, () => console.log("server runnnig!!"));