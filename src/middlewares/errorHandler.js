<<<<<<< HEAD
// 에러 미들웨어는 항상 (설령 안 쓰더라도)
// error~next의 4개 인자를 설정해 주어야 함.
function errorHandler(error, req, res, next) {
  // 터미널에 노란색으로 출력됨.
  console.log("\x1b[33m%s\x1b[0m", error.stack);
  const { statusCode = 500, message = "Server-side Problem" } = error;
  // 에러는 400 코드의 JSON 형태로 프론트에 전달됨
  res.status(statusCode).json({ result: "error", reason: message });
=======
import { NotFoundError } from '../utils/index.js';
import { app } from '../app.js';

function notFoundErrorHandler(req, res, next) {
  next(new NotFoundError('페이지를 찾을 수 없습니다.'));
}

function errorHandler(error, req, res, next) {
  console.log('\x1b[33m%s\x1b[0m', error.stack);

  const { statusCode = 500, message = 'Server-side Problem' } = error;
  app.locals = {
    statusCode,
    message,
  };

  res.redirect('/errorPage');
>>>>>>> dev
}

export { errorHandler };
