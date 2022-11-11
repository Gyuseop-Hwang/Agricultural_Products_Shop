import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import ejs from 'ejs';

import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import {
  viewsRouter,
  userRouter,
  productRouter,
  adminProductRouter,
  adminCategoryRouter,
  orderRouter,
} from './routers/index.js';

import {
  loginRequired,
  authRequired,
  notFoundErrorHandler,
  errorHandler,
} from './middlewares/index.js';

import path from 'path';
const app = express();

app.use(morgan('dev'));

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(viewsRouter);

app.set('view engine', 'ejs');
app.set('views', './views/');
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.renderFile);

app.use('/api', userRouter);
app.use('/api', productRouter);
app.use('/api/admin', loginRequired, authRequired, adminProductRouter);
app.use('/api/admin', loginRequired, authRequired, adminCategoryRouter);
app.use('/api', loginRequired, orderRouter);

app.use('*', notFoundErrorHandler);
app.use(errorHandler);

export { app };
