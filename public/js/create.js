// data fetching
const inputAnswerDOM = document.getElementById("inputAnswer");
const inputContentDOM = document.getElementById("inputContent");
//formDomを追加する。
const formDOM = document.querySelector(".form-section");
const threadSectionDOM = document.querySelector(".thread-section");
let answerText = "";
let contentText = "";

//最初はThreadを全て読み込む
const getAllThreads = async () => {
  try {
    let allThreads = await axios.get("/api/v1/questions");//パスに沿ってAPIをたたきにいく
    let { data } = allThreads;
    //出力
    allThreads = data
      .map((thread) => {
        const { _id, content, answer } = thread;
        return `
      <div class="single-thread">
        <p>${content}</p>
        <p>${answer}</p>
        <input type="button" value="削除" id="${_id}" onclick="selectItemDel(id);removeExample(this)">
        </div>
      `;
      })
      .join("");
    //挿入
    threadSectionDOM.innerHTML = allThreads;
  } catch (err) {
    console.log(err);
  }
};

getAllThreads();//エクスポートする

//タイトルと内容を打ち込んだらpostメソッドを実装してデータ追加。
inputAnswerDOM.addEventListener("change", (e) => {
  answerText = e.target.value;
});
inputContentDOM.addEventListener("change", (e) => {
  contentText = e.target.value;
});

formDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (answerText && contentText) {
    console.log("success");
    //postメソッドで送信する。
    inputContentDOM.focus();//フォーカスをあてる

    try {
      await axios.post("/api/v1/question", {//req.bodyに該当
        _id: getRandomId(),
        content: contentText,
        answer: answerText,
        correctFlag: true,//デフォルトはfalseで設定
      });
      getAllThreads();
      
    } catch (err) {
      console.log(err);
    }

    //投稿したらinputのvalueを削除
    answerTextText = "";
    contentText = "";
    inputAnswerDOM.value = "";
    inputContentDOM.value = "";
  } else {
    console.log("error");
  }
});

async function selectItemDel(id, button) {
  let url = "/api/v1/" + id;
  console.log(url);
  try {
    await axios.delete(url);
    getAllThreads();
  } catch (err) {
    console.log(err);
  }
}

//自身の親要素を含めて画面から削除する関数
function removeExample(button) {
  if (window.confirm('本当に削除しますか？')) {
    let parent = button.parentNode;
    parent.remove();
  }
}

//IDを生成する関数
function getRandomId() {
  // 生成する文字列の長さ
  var l = 16;

  // 生成する文字列に含める文字セット
  var c = "abcdefghijklmnopqrstuvwxyz0123456789";

  var cl = c.length;
  var r = "";//返す文字列
  for(var i=0; i<l; i++){
    r += c[Math.floor(Math.random()*cl)];
  }

  return r;
}