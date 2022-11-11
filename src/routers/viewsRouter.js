import express from "express";
import path from "path";
import { app } from "../app.js";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

import { productService } from "../services/index.js";
import { adminCategoryService } from "../services/index.js";
import { orderService } from "../services/index.js";
const viewsRouter = express.Router();

viewsRouter.use("/", serveStatic(""));

// 페이지별로 html, css, js 파일들을 라우팅함
// 아래와 같이 하면, http://localhost:5000/ 에서는 views/home/home.html 파일을,
// http://localhost:5000/register 에서는 views/register/register.html 파일을 화면에 띄움
viewsRouter.all("/", (req, res, next) => {
  res.render("home/home.ejs");
});
viewsRouter.use("/register", (req, res, next) => {
  res.render("register/register.ejs");
});
viewsRouter.use("/login", (req, res, next) => {
  res.render("login/login.ejs");
});
viewsRouter.use("/admin/category", (req, res, next) => {
  res.render("adminCategory/adminCategory.ejs");
});
viewsRouter.use("/userInfo", (req, res, next) => {
  res.render("userInfo/userInfo.ejs");
});
viewsRouter.use("/orderHistory", (req, res, next) => {
  res.render("orderHistory/orderHistory.ejs");
});

viewsRouter.use(`/orderHistoryDetail/:orderId`, (req, res, next) => {
  const { orderId } = req.params;

  res.render("orderHistoryDetail/orderHistoryDetail.ejs", { orderId });
});

viewsRouter.use("/errorPage", (req, res) => {
  // const error = {};
  // error.statusCode = app.locals.statusCode;
  // error.message = app.locals.message;
  const { statusCode = 500, message = "서버에 문제가 발생했습니다." } =
    app.locals;
  res
    .status(statusCode)
    .render("errorPage/errorPage.ejs", { statusCode, message });
});

viewsRouter.use("/adminPage", (req, res, next) => {
  res.render("adminPage/adminPage.ejs");
});

viewsRouter.use("/cart", (req, res, next) => res.render("cart/cartPage.ejs"));

viewsRouter.use("/order", (req, res, next) => res.render("order/order.ejs"));
viewsRouter.use("/orderSuccess", (req, res, next) =>
  res.render("orderSuccess/orderSuccess.ejs")
);
viewsRouter.use("/admin/orders", async (req, res, next) => {
  try {
    const orders = await orderService.findAllOrders();
    res.render("adminOrders/adminOrders.ejs", { orders });
  } catch (err) {
    console.log(err);
  }
});

viewsRouter.use("/admin/products/add", async (req, res, next) => {
  const product = {
    title: "",
    image: { path: "" },
    price: "",
    quantity: "",
    description: "",
  };
  const categories = await adminCategoryService.getAllCategories();
  res.render("productsAddUpdate/productsAddUpdate.ejs", {
    product,
    categories,
  });
});
viewsRouter.use("/admin/products/:productId", async (req, res, next) => {
  try {
    const productId = req.params.productId;
    if (productId !== "add") {
      const product = await productService.getProduct(productId);
      const categories = await adminCategoryService.getAllCategories();
      res.render("productsAddUpdate/productsAddUpdate.ejs", {
        product,
        categories,
      });
    }
  } catch (err) {
    console.log(err);
  }
});
viewsRouter.use("/admin/products", async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    res.render("adminProducts/adminProducts.ejs", { products });
  } catch (err) {
    console.log(err);
  }
});

// http://localhost:5000/search 에서는 views/searchProducts/register.html 파일을 화면에 띄움

viewsRouter.use("/search?title", async (req, res, next) => {
  try {
    const title = req.query.title;
    const products = await productService.searchProducts(title);
    res.render("searchProducts/searchProducts.ejs", { products });
  } catch (e) {
    console.log(e);
    res.redirect("/search");
  }
});

viewsRouter.use("/search/:categoryId", async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const products = await productService.getProductsByCategory(categoryId);
    res.render("searchProducts/searchProducts.ejs", { products });
  } catch (e) {
    console.log(e);
    res.redirect("/search");
  }
});
viewsRouter.use("/search", async (req, res, next) => {
  try {
    let products;
    /*검색어 있는 경우*/
    if (req.query.title) {
      console.log(req.query.title);
      products = await productService.searchProducts(req.query.title);
      res.render("searchProducts/searchProducts.ejs", { products });
    }
    products = await productService.getAllProducts();
    res.render("searchProducts/searchProducts.ejs", { products });
  } catch (e) {
    console.log(e);
    res.redirect("/search");
  }
});
/*상품 상세 페이지 라우팅 */
viewsRouter.use("/product/:productId", async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const product = await productService.getProduct(productId);
    res.render("productDetail/productDetail.ejs", { product });
  } catch (e) {
    console.log(e);
    res.redirect("/search");
  }
});
// views 폴더의 최상단 파일인 rabbit.png, api.js 등을 쓸 수 있게 함

// views폴더 내의 ${resource} 폴더 내의 모든 파일을 웹에 띄우며,
// 이 때 ${resource}.html 을 기본 파일로 설정함.
function serveStatic(resource) {
  const resourcePath = path.join(__dirname, `../views/${resource}`);
  const option = { index: `${resource}.html` };

  // express.static 은 express 가 기본으로 제공하는 함수임
  return express.static(resourcePath, option);
}

export { viewsRouter };
