//DOM宣言
const scoreBtnDOM = document.getElementById("score-btn");
const inputScoreDOM = document.getElementById("inputScore");
//代入用変数
let contentText = "";

//最初はThreadを全て読み込む
const getAllScores = async () => {
  try {
    let allScores = await axios.get("/sss/v1/scores");//パスに沿ってAPIをたたきにいく
  } catch (err) {
    console.log(err);
  }
};
//エクスポート
getAllScores();

//テキストボックスイベント
inputScoreDOM.addEventListener("change", (e) => {
  contentText = e.target.value;
});

//
scoreBtnDOM.addEventListener("click", async (e) => {
  e.preventDefault();
  console.log(contentText);
  if (contentText) {
    console.log("success");
    //postメソッドで送信する。
    inputScoreDOM.focus();//フォーカスをあてる
    try {
      await axios.post("/sss/v1/score", {//req.bodyに該当
        score: contentText,
      });
      getAllScoress();
    } catch (err) {
      console.log(err);
    }

    //投稿したらinputのvalueを削除
    contentText = "";
    inputScoreDOM.value = "";
  } else {
    console.log("error");
  }
});