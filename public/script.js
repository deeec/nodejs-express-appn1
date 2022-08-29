// data fetching←投稿ゾーンのタグのID,DOM要素,変数(パラメータ)
const inputTextDOM = document.getElementById("inputTitle");
const inputContentDOM = document.getElementById("inputContent");
const formDOM = document.querySelector(".form-section");
let inputText = "";
let contentText = "";

//formDomを追加する。DBから読み込んだデータを挿入する位置の指定DOM？的なやつ
const threadSectionDOM = document.querySelector(".thread-section");

//最初はThreadを全て読み込む
const getAllThreads = async () => {
  try {
    console.log("show");
    let allThreads = await axios.get("/api/v1/threads");
    console.log(allThreads);
    let { data } = allThreads;
    //出力
    allThreads = data
      .map((thread) => {
        const { title, content } = thread;
        console.log(title);
        //HTMLのひな型を返すことでスレッドが増える
        return `
      <div class="single-thread">
          <h3>${title}</h3>
          <p>${content}</p>
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

getAllThreads();

//タイトルと内容を打ち込んだらpostメソッドを実装してデータ追加。
inputTextDOM.addEventListener("change", (e) => {
  //   console.log(e.target.value);
  inputText = e.target.value;
});
inputContentDOM.addEventListener("change", (e) => {
  contentText = e.target.value;
});

formDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (inputText && inputContent) {
    console.log("success");
    //postメソッドで送信する。

    try {
      console.log(inputText);
      await axios.post("/ap1/v1/thread", {
        title: inputText,
        content: contentText,
      });
      getAllThreads();
    } catch (err) {
      console.log(err);
    }

    //投稿したらinputのvalueを削除
    inputText = "";
    contentText = "";
    inputTextDOM.value = "";
    inputContentDOM.value = "";
  } else {
    console.log("error");
  }
});