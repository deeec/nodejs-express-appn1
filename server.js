const express = require("express");
const app = express();
const mongoose = require("mongoose");//mongooseを使用する宣言
app.use(express.static("public"));
app.use(express.json());

//mongoDBに接続
mongoose.connect(
    "mongodb+srv://d-hori18:d-hori@cluster0.4v0ab4l.mongodb.net/database1?retryWrites=true&w=majority"
).
then(() => console.log("db connected!"))
.catch((err) => console.log(err));

//データベースアクセスを行うためのミドルウェア
const question_db = require("./db/question_db")//
const score_db = require("./db/score_db")//

//コントローラをインポート
const router = require("./routes/router");

const { showTop } = require("./controllers/homeController");

//テンプレートエンジン
app.set("view engine", "ejs");

//ルーティングの処理はControllerに任せる
app.use("/pages", router);

//トップページを表示
app.get("/", showTop);

//db接続する
app.use("/api", question_db);
app.use("/sss", score_db);

app.listen(process.env.PORT || 3000, () => console.log("server running"));