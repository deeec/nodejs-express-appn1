//formDomを追加する。
const questionDOM = document.querySelector(".que-section");
const quesOptionDOM = document.getElementById("queVol");
const subBtnDOM = document.getElementById("subBtnId");
var singleQueDOM = document.getElementsByClassName("single-que");
var ckCrrctDOM = document.getElementsByClassName("ckCrrct");
const heroDOM = document.getElementById("heroId"); 
const ckWeakDOM = document.getElementById("ckWeakId");

//オプションボタンの選択値:はじめは5で設定
var optionValue = 5;
var ttlDtNum;
var tempScore;

//questionDOMを最初は非表示
questionDOM.style.display = "none";

//最初はThreadを全て読み込む
const getAllQuestions = async () => {
  try {
    let array = await axios.get("/api/v1/questions");//パスに沿ってAPIをたたきにいく
    let { data } = array;//マップ関数で扱うために一旦格納

    //TODO:前回間違えたものを選別できるような関数を挿入
    if(ckWeakDOM.checked == true){
      data = selWeakQue(data);
    }

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
          <label><input class="ckCrrct" value=${_id} type="checkbox">正解時チェック</label>
          </div>
        </div>
      `;
      }
    })
    .join("");
    //挿入
    questionDOM.innerHTML = array;
  } catch (err) {
    console.log(err);
  }
};

getAllQuestions();//エクスポートする


//optionボタンイベント
quesOptionDOM.addEventListener("change", async (e) => {
  optionValue = Number( e.target.value );
  try {
    getAllQuestions();
  } catch (err) {
    console.log(err);
  }
});

//苦手な問題を選別する
function selWeakQue(data) {
  var result = data.filter(function( data ) {
    return data.correctFlag === false;
  });
  console.log(result);
  return result;
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
async function testStart() {
  questionDOM.style.display = "block";
  document.getElementById("heroId").innerHTML +=
   `<input class="subBtn2" type="button" value="終了" onclick="checkCorrect();sendScore()">`;
};

//正誤をつける関数
async function checkCorrect() {
  var correctNum = 0;
  for(var i = 0; i < ckCrrctDOM.length; i++) {
    //console.log(ckCrrctDOM[i].checked + " " + ckCrrctDOM[i].value);
    //正解のとき
    if(ckCrrctDOM[i].checked == true) {
      correctNum = correctNum + 1;
      updateQueInfo(ckCrrctDOM[i].value, true);
    } else {//不正解のときはフラグをfalseで更新
      updateQueInfo(ckCrrctDOM[i].value, false);
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
  console.log(now);

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

//問題の正誤結果を送信する関数
async function updateQueInfo(id, flag) {
  let url = "/api/v1/upd/" + id;
  try {
    await axios.patch(url, {
      correctFlag: flag,
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

    testStart();//テスト開始
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