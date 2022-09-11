//formDomを追加する。
const questionDOM = document.querySelector(".que-section");
const questionDOM2 = document.querySelector(".que-section2");
const quesOptionDOM = document.getElementById("queVol");
const subBtnDOM = document.getElementById("subBtnId");
var singleQueDOM = document.getElementsByClassName("single-que");
var ckCrrctDOM = document.getElementsByClassName("ckCrrct");
var ckCrrctDOM2 = document.getElementsByClassName("ckCrrct2");
const heroDOM = document.getElementById("heroId"); 
const ckWeakDOM = document.getElementById("ckWeakId");

//オプションボタンの選択値:はじめは5で設定
var optionValue = 5;
var ttlDtNum;//全データ数
var tempScore = 0;
var queCount = 1;
let htmlArray;//html要素を持っている変数
let dataAry;//DBをデータとして保持する
var isShutudai;//出題済みの問題かをチェックする配列

//最初はThreadを全て読み込む
const getAllQuestions = async () => {
  try {
    htmlArray = await axios.get("/api/v1/questions");
    let { data } = htmlArray;//マップ関数で扱うために一旦格納

    //DBから取得したデータを配列に格納する
    dataAry = data
    .map((que) => {
      const {_id, content, answer, correctFlag} = que;//問題文のみ
      return que;
    });
    printArray(dataAry);

    //DBから取得したデータを配列に格納する
    htmlArray = data
    .map((que) => {
      const {_id, content, answer, correctFlag} = que;//問題文のみ
      return `
      <div class="single-que">
          <p>${content}</p>
          <p>${correctFlag}</p>
          <textarea id="inputAnswer"></textarea>
          <input type="button" value="解答" onclick=visibleCon("${_id}")>
          <div class="ans-zone" id=${_id}>
          <p class="ansBtn">${answer}</p>
          <label><input class="ckCrrct" name="radio-btn" id=${_id} type="radio" onclick=updateQueInfo(id,true)>正解</label>
          <label><input class="ckCrrct2" name="radio-btn" id=${_id} type="radio" onclick=updateQueInfo(id,false)>不正解</label>
          </div>
        </div>
      `;
    });

    ttlDtNum = htmlArray.length;//全データ数を取得
    isShutudai = new Array(ttlDtNum);
    for(var i = 0; i < ttlDtNum; i++) {
      isShutudai[i] = false;//全問題未出題にする
    }
    getMissQue();
    
  } catch (err) {
    console.log(err);
  }
};

getAllQuestions();//エクスポートする

//html要素挿入関数
document.getElementById("next-btn-id").addEventListener("click", () => {

  if(ttlDtNum < queCount){
    document.getElementById("select-zone-id").innerHTML = ``;
    questionDOM.innerHTML = `<div>全問題が終了しました。</div>`;
    document.getElementById("heroId").innerHTML +=
   `<input class="subBtn2" type="button" value="終了" onclick="checkCorrect();sendScore()">`;
    return;
  }

  // //正解、不正解のラジオボタンチェック箇所
  // const radioBtnDOM = document.getElementsByName("radio-btn")
  // var isRadioChecked;
  // for(var i = 0; i < radioBtnDOM.length; i++) {
  //   isRadioChecked = radioBtnDOM[i].checked;
  //   console.log(radioBtnDOM[i].checked);
  //   if(isRadioChecked) break;
  // }
  // //ラジオボタンがチェックされていないとき
  // if(isRadioChecked == false){
  //   document.getElementById("select-zone-id").innerHTML += `<div>未チェック</div>`;
  //   return; 
  // }


  //問題を出題する箇所
  questionDOM.innerHTML = `<h3>${queCount}/${ttlDtNum}</h3>`;
  while(true) {
    var rand = Math.floor( Math.random() * ttlDtNum );//全データ数の中からランダムに問題を選択
    if(getMissQue(rand) == true){
      questionDOM.innerHTML += htmlArray[rand]; 
      queCount = queCount + 1;
      break;
    }
  }
  console.log("未出題の問題を発見しました。");
  console.log(isShutudai);
})

//配列を表示する関数
function printArray(array) {
  for(var i = 0; i < array.length; i++) {
    console.log(i + "識別子：" + array[i]._id);
    console.log(i + "内容：" + array[i].content);
    console.log(i + "解答：" + array[i].answer);
    console.log(i + "フラグ：" + array[i].correctFlag);
  }
}

//前回不正解問題を探す
function getMissQue(rand) {
  if(isShutudai[rand] == false){//乱数の結果その問題が未出題のとき
    isShutudai[rand] = true
    return true;
  }
  return false;
}

//正解不正解を送信する
async function updateQueInfo(id, flag) {
  let url = "/api/v1/upd/" + id;

  if(flag){tempScore = tempScore + 1;}
  console.log("送信完了:" + flag);

  try {
    await axios.patch(url, {
      correctFlag: flag,
    });
    getAllQuestions();
  } catch (err) {
    console.log(err);
  }
}

//解答ゾーンを開いたり閉じたりする
function visibleCon(id) {
  if(document.getElementById(id).style.display != "block"){
    document.getElementById(id).style.display = "block";
  } else {
    document.getElementById(id).style.display = "none";
  }
};

//正誤をつける関数
async function checkCorrect() {
  //正答率の画面を挿入
  heroDOM.innerHTML =
   `<h3>正答率
   <div class="correct">
   ${(tempScore/ttlDtNum) * 100}%</div>
   </h3>
   <a href="/pages/score" >成績画面へ</a>`;
};

//成績を送る
async function sendScore() {
  try {
    await axios.post("/sss/v1/score", {//req.bodyに該当
      score: tempScore,
      examDate: getDateStr(),
    });
  } catch (err) {
    console.log(err);
  }
};

//日付を文字列で取得
function getDateStr() {
  var now = new Date();

  var Year = now.getFullYear();
  var Month = now.getMonth()+1;
  var date = now.getDate();
  var Hour = now.getHours();
  var Min = now.getMinutes();

  var dtStr = Year + "/" + Month + "/" + date + " " + Hour + ":" + Min;

  return dtStr;//日付を文字列で返す
}