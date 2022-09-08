//DOM宣言
const scoreTableDOM = document.getElementById("score-tableId");
//代入用変数
let contentText = "";

//最初はThreadを全て読み込む
const getAllScores = async () => {
  try {
    let allScores = await axios.get("/sss/v1/scores");//パスに沿ってAPIをたたきにいく
    let {data} = allScores;
    crtScrBrd(data);
  } catch (err) {
    console.log(err);
  }
};

//エクスポート
getAllScores();

//成績票を作成する関数
function crtScrBrd(array) {
  var lastIndex = array.length - 1;
  for(var i = 0; i < array.length; i++){
    const {examDate, score} = array[lastIndex - i];
    scoreTableDOM.innerHTML += 
    `<tr>
    <td>${examDate}</td>
    <td class="score-point">${score * 100}%</td>
    </tr>`;
  }
};
