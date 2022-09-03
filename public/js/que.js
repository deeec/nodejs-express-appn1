//formDomを追加する。
const questionDOM = document.querySelector(".que-section");
var singleQueDOM = document.getElementsByClassName("single-que");

//最初はThreadを全て読み込む
const getQuestions = async () => {
  try {
    let all = await axios.get("/api/v1/questions");//パスに沿ってAPIをたたきにいく
    let { data } = all;
    //出力
    all = data
      .map((thread) => {
        const {title, content} = thread;
        return `
      <div class="single-que">
          <h3>${title}</h3>
          <p>${content}</p>
        </div>
      `;
      })
      .join("");
    //挿入
    questionDOM.innerHTML = all;
  } catch (err) {
    console.log(err);
  }
};

getQuestions();//関数としてエクスポート←外部でも使えるように

//完了ボタン押下時
function doneTest() {
  for(var i = 0; i < singleQueDOM.length; i++) {
    console.log(singleQueDOM[i]);
  }
};