import { NotFoundError } from "../utils";

function notFoundErrorHandler(req, res, next) {
  next(new NotFoundError("페이지를 찾을 수 없습니다."));
}

function errorHandler(error, req, res, next) {
  // 터미널에 노란색으로 출력됨.
  console.log("\x1b[33m%s\x1b[0m", error.stack);
  const { statusCode = 500, message = "Server-side Problem" } = error;
  // res.redirect("/errorPage");
  // res.status(statusCode).json({ result: "error", reason: message });
  res.render("../views/errorPage/errorPage.ejs", {
    statusCode,
    result: "error",
    reason: message,
  });
}

export { notFoundErrorHandler, errorHandler };
