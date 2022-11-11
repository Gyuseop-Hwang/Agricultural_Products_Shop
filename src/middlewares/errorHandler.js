import { NotFoundError } from '../utils/index.js';
import { app } from '../app.js';

function notFoundErrorHandler(req, res, next) {
  next(new NotFoundError('페이지를 찾을 수 없습니다.'));
}

function errorHandler(error, req, res, next) {
  console.log('\x1b[33m%s\x1b[0m', error.stack);
  app.locals.statusCode = error.statusCode;
  app.locals.message = error.message;
  res.redirect('/errorPage');
}

export { notFoundErrorHandler, errorHandler };
