const express = require("express");
const app = express();

// ejs 엔진을 실행하기 위한 코드
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/data", function (req, res) {
  var context = [
    { a: "Hello", b: "World" },
    { a: "javacript", b: "is ..." },
    { a: "web", b: "is ..." },
  ];
  // data라는 이름으로 전달
  // ejs 파일에서는 data[1].a 와 같은 형식으로 사용
  res.render("orderHistory.ejs", { data: context }, function (err, html) {
    if (err) {
      console.log(err);
    }
    res.end(html); // 응답 종료
  });
});
