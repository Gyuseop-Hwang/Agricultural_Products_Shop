import cors from "cors";
import express from "express";
import morgan from "morgan";

import {
  viewsRouter,
  userRouter,
  productRouter,
  adminProductRouter,
  adminCategoryRouter,
  orderRouter,
} from "./routers";

import {
  loginRequired,
  authRequired,
  notFoundErrorHandler,
  errorHandler,
} from "./middlewares";

import path from "path"; //승연
const app = express();

// log 기록
app.use(morgan("dev"));

// CORS 에러 방지
app.use(cors());

// Content-Type: application/json 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.json());

// Content-Type: application/x-www-form-urlencoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

// html, css, js 라우팅
app.use(viewsRouter);

//ejs 사용
app.set("view engine", "ejs");
app.set("views", "./views/");
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);

// api 라우팅
app.use("/api", userRouter);
app.use("/api", productRouter);
app.use("/api/admin", loginRequired, authRequired, adminProductRouter);
app.use("/api/admin", loginRequired, authRequired, adminCategoryRouter);
app.use("/api", loginRequired, orderRouter);

// 404, 그 밖에 error 처리
app.use("*", notFoundErrorHandler);
app.use(errorHandler);

export { app };