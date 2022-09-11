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
var ttlDtNum;
var tempScore;
var hardFlag = false;
let array = "";

//questionDOMを最初は非表示
questionDOM.style.display = "none";
questionDOM2.style.display = "none";

//最初はThreadを全て読み込む
const getAllQuestions = async () => {
  try {
    array = await axios.get("/api/v1/questions");//パスに沿ってAPIをたたきにいく
    let { data } = array;//マップ関数で扱うために一旦格納

    ttlDtNum = data.length;//データの総数を取得
    var count = -1;//カウンタ変数
    var index = 0;//
    var selected = getRamArray();//対象の問題番号を記載した数字
    //挿入HTML生成ゾーン
    array = data
    .map((que) => {
      const {_id, content, answer} = que;//問題文のみ
      count = count + 1;//mapの要素を取得する度に増分

      //TODO：出力するかしないかをここで判断
      if(selected[index] == count) {
        index = index + 1;

        return `
      <div class="single-que">
          <h3>問${index}</h3>
          <p>${content}</p>
          <textarea id="inputAnswer"></textarea>
          <input type="button" value="解答" onclick=visibleCon("${_id}")>
          <div class="ans-zone" id=${_id}>
          <p class="ansBtn">${answer}</p>
          <label><input class="ckCrrct" id=${_id} type="checkbox" onclick=updateQueInfoT(this)>正解</label>
          <label><input class="ckCrrct" id=${_id} type="checkbox" onclick=updateQueInfoF(this)>不正解</label>
          </div>
        </div>
      `;
      }
    })
    .join("");
    //挿入
    questionDOM.innerHTML = array;
    console.log(array);
  } catch (err) {
    console.log(err);
  }
};

getAllQuestions();//エクスポートする

//苦手な問題を選別する
function selWeakQue(data) {
  for(var i = 0; i < data.length; i++) {
    if(data[i].correctFlag) {
      data.splice(i, 1);
      i = i - 1;
    }
  }
  return data;
};


//解答ゾーンを開いたり閉じたりする
function visibleCon(id) {
  if(document.getElementById(id).style.display != "block"){
    document.getElementById(id).style.display = "block";
  } else {
    document.getElementById(id).style.display = "none";
  }
};

//開始ボタン押下時
function testStart() {
  questionDOM.style.display = "block";
  document.getElementById("heroId").innerHTML +=
   `<input class="subBtn2" type="button" value="終了" onclick="checkCorrect();sendScore()">`;
};

//正誤をつける関数
async function checkCorrect() {
  var correctNum = 0;

  for(var i = 0; i < ckCrrctDOM.length; i++) {
    //正解のとき
    if(ckCrrctDOM[i].checked == true) {
      correctNum = correctNum + 1;
    }
  }
  //成績を保持
  tempScore = calcScore(correctNum);

  //正答率の画面を挿入
  heroDOM.innerHTML =
   `<h3>正答率
   <div class="correct">
   ${tempScore * 100}%</div>
   </h3>
   <a href="/pages/score" >成績画面へ</a>`;
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

async function updateQueInfoF(ele) {
  let url = "/api/v1/upd/" + ele.id;

  try {
    await axios.patch(url, {
      correctFlag: false,
    });
    getAllQuestions();
  } catch (err) {
    console.log(err);
  }
}

//問題の正解を送信する関数
async function updateQueInfoT(ele) {
  let url = "/api/v1/upd/" + ele.id;

  try {
    await axios.patch(url, {
      correctFlag: true,
    });
    getAllQuestions();
  } catch (err) {
    console.log(err);
  }
}

//正答率を計算
function calcScore(correctNum) {
  return Number(correctNum) / optionValue;
}

//自身の親要素を含めて画面から削除する関数
function removeExample(button) {
  if (window.confirm('テストを開始してもよろしいですか？')) {
    let parent = button.parentNode;
    parent.remove();
    shokikaFlag = true;
    testStart();//テスト開始
    //getAllQuestions();
  }
}

//数値比較を行うための関数
function compareFunc(a, b) {
  return a - b;
}

//乱数配列を生成する関数
function getRamArray() {
  var ranArry = [];//配列を初期化
  for(var i = 0; i < ttlDtNum; i++) {//全データ数分行う
    ranArry[i] = i;//代入
  }

  if(ttlDtNum < optionValue){
    optionValue = ttlDtNum;
  }
  
  //配列分の要素をシャッフルする
  while (ttlDtNum) {
      var ranArryPt = Math.floor( Math.random() * ttlDtNum );//指定した範囲内で配列の要素を無作為に指定
      var lastArryPt = ranArry[--ttlDtNum];//最後の要素を取得
      ranArry[ttlDtNum] = ranArry[ranArryPt];//無作為に指定した要素を最後の要素に代入
      ranArry[ranArryPt] = lastArryPt;//元々最後尾に入っていた要素を入れ替える
  }

  //返す配列を生成
  var reArry = [];//返す配列
  //console.log("ok!" + optionValue);
  for(var i = 0; i < optionValue; i++) {//全データ数分行う
    reArry[i] = ranArry[i];//代入
  }

  //console.log(reArry);
  reArry.sort(compareFunc);
  //console.log(reArry);
  //ソートして返却
  return reArry;
}