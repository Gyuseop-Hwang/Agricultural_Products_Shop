import express from "express";
import path from "path";
import { app } from "../app";

import { productService } from "../services";
import { adminCategoryService } from "../services";
import { orderService } from "../services";
const viewsRouter = express.Router();

// 페이지별로 html, css, js 파일들을 라우팅함
// 아래와 같이 하면, http://localhost:5000/ 에서는 views/home/home.html 파일을,
// http://localhost:5000/register 에서는 views/register/register.html 파일을 화면에 띄움
viewsRouter.use("/home", async (req, res, next) => {
  res.render("home/home.ejs");
});
viewsRouter.use("/register", serveStatic("register"));
viewsRouter.use("/login", serveStatic("login"));
viewsRouter.use("/admin/category", serveStatic("adminCategory"));
viewsRouter.use("/userInfo", async (req, res, next) => {
  res.render("userInfo/userInfo.ejs");
});
viewsRouter.use("/orderHistory", async (req, res, next) => {
  res.render("orderHistory/orderHistory.ejs");
});

viewsRouter.use("/orderHistoryDetail", async (req, res, next) => {
  res.render("orderHistoryDetail/orderHistoryDetail.ejs");
});

viewsRouter.use("/errorPage", async (req, res) => {
  const error = {};
  error.statusCode = app.locals.statusCode;
  error.message = app.locals.message;
  res.render("errorPage/errorPage.ejs", { error });
});

viewsRouter.use("/cart", async (req, res, next) => res.render("cart/cart.ejs"));
viewsRouter.use("/order", async (req, res, next) =>
  res.render("order/order.ejs")
);
viewsRouter.use("/orderSuccess", serveStatic("orderSuccess"));
viewsRouter.use("/adminOrders", async (req, res, next) => {
  try {
    const orders = await orderService.findAllOrders();
    res.render("adminOrders/adminOrders.ejs", { orders });
  } catch (err) {
    console.log(err);
  }
});

viewsRouter.use("/adminProducts/add", async (req, res, next) => {
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
viewsRouter.use("/adminProducts/:productId", async (req, res, next) => {
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
viewsRouter.use("/adminProducts", async (req, res, next) => {
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
viewsRouter.use("/", serveStatic(""));

// views폴더 내의 ${resource} 폴더 내의 모든 파일을 웹에 띄우며,
// 이 때 ${resource}.html 을 기본 파일로 설정함.
function serveStatic(resource) {
  const resourcePath = path.join(__dirname, `../views/${resource}`);
  const option = { index: `${resource}.html` };

  // express.static 은 express 가 기본으로 제공하는 함수임
  return express.static(resourcePath, option);
}

export { viewsRouter };
