import * as Api from "./api.js";

const cartProductList = document.getElementById("cartProductList");
const deleteSelectedButton = document.getElementById("deleteSelectedButton");
const deleteAllButton = document.getElementById("deleteAllButton");
const totalPriceTxt = document.getElementById("totalPrice");
const orderButton = document.getElementById("orderButton");

const cartOrOrderPage = window.location.pathname.split("/")[1];

let products = []; // 상품 전체 정보가 담김
let savedProducts = JSON.parse(localStorage.getItem("products")); // [id, count]
let TOTAL_PRICE;

// 수량 변경 및 삭제 시 새 배열 만들어서 로컬스토리지 저장
function saveToLocalStorage(newProducts) {
  const products = newProducts.map((product) => {
    if (product.product) {
      // api 호출시 불러온 데이터일 때
      return { id: product.product._id, count: product.count };
    }
    // 선택 삭제 클릭시
    return { id: product.id, count: product.count };
  });
  localStorage.setItem("products", JSON.stringify(products));
}

// 처음 get요청시 products배열에 저장 => 로컬스토리지 저장(saveProductsToLocalStorage) 및 dom에 추가(printProduct, sumPrice)
function saveProduct(product, count, index) {
  const newProductObj = { product, count };
  for (let i = 0; i < products.length; i++) {
    // (수량 추가 시) 기존에 있는 상품이면 수량만 추가
    if (products[i].product === newProductObj.product) {
      products[i] = newProductObj;
      const totalPrice = document.getElementById(`totalPrice${index}`);
      totalPrice.innerText = `${(product.price * count).toLocaleString()}원`;
      saveToLocalStorage(products);
      return;
    }
  }
  // (처음 get 요청 시)
  products.push(newProductObj);
  saveToLocalStorage(products);
  printProduct(product, count, index);
  sumPrice();
}

// 선택 항목 삭제
function deleteSelectedProduct() {
  const checkBoxes = document.querySelectorAll(".check-box");
  // dom에서 선택항목 삭제
  for (let i = 0; i < checkBoxes.length; i++) {
    if (checkBoxes[i].checked === true) {
      checkBoxes[i].parentElement.parentElement.remove();
    }
  }
  // products 배열에 저장
  products = products.filter(({ product }) => {
    for (let i = 0; i < checkBoxes.length; i++) {
      if (
        checkBoxes[i].checked !== true &&
        checkBoxes[i].dataset.productId === product._id
      ) {
        return true;
      }
    }
  });
  //localstorage에 선택항목 삭제된 배열 저장 [id, count]
  const newProducts = savedProducts.filter((product) => {
    for (let i = 0; i < checkBoxes.length; i++) {
      if (
        checkBoxes[i].checked !== true &&
        checkBoxes[i].dataset.productId === product.id
      ) {
        return true;
      }
    }
  });

  saveToLocalStorage(newProducts);
  sumPrice();

  // 모든 상품이 삭제됐을 경우 "장바구니가 비었습니다" 메세지 출력
  if (newProducts.length < 1) {
    localStorage.clear();
    savedProducts = null;
    cartOrOrderPage === "cart" && emptyCartMessage.classList.remove("hidden");
  }
}

function deleteAllProduct() {
  // dom에서 전체 삭제
  const allProduct = document.querySelectorAll(".product");
  allProduct.forEach((product) => product.remove());
  emptyCartMessage.classList.remove("hidden");
  localStorage.clear();
  savedProducts = null;

  sumPrice();
}

// dom에 장바구니 항목 추가
function printProduct(product, count, index) {
  const { _id, image, title, price, sale } = product;

  const tr = document.createElement("tr");
  tr.className = "product";
  tr.innerHTML = `<td class="check-box-td">
      <input type="checkbox" class="check-box"  data-product-id="${_id}"/>
    </td>
    <td class="product-name has-text-left">
      <img src="${image.path}" alt="${title}"/>
      <div>
        <a href="/product/${_id}" class="mb-2">${title}</a>
        <p id="price${index}"><span>${price.toLocaleString()}원</span></p>
      </div>
    </td>
    <td class="product-quantity">
    ${
      cartOrOrderPage === "cart"
        ? `<input type="number" class="number-input mb-4" id="countInput${index}"  value="${count}" min="1"/>
      <button class="change-count-button" id="changeCountButton${index}" data-product-id="${_id}">변경</button>`
        : ""
    }
    ${cartOrOrderPage !== "cart" ? count : ""}
    </td>
    <td class="product-total-price" id="totalPrice${index}">${
    sale.onSale
      ? (sale.discountedPrice * count).toLocaleString()
      : (price * count).toLocaleString()
  }원</td>`;

  cartProductList.appendChild(tr);

  // 세일가 적용
  const priceArea = document.getElementById(`price${index}`);
  const priceSpan = document.querySelector(`#price${index} span`);
  if (sale.onSale === true) {
    priceArea.prepend(`${sale.discountedPrice.toLocaleString()}원`);
    priceSpan.style.textDecoration = "line-through";
    priceSpan.style.color = "#bbb";
    priceSpan.style.fontSize = "14px";
  }

  // 수량 변경 이벤트
  if (cartOrOrderPage === "cart") {
    const changeCountButtons = document.getElementById(
      `changeCountButton${index}`
    );
    const numberInput = document.getElementById(`countInput${index}`);

    changeCountButtons.addEventListener("click", () => {
      saveProduct(product, numberInput.value, index);
      sumPrice();
    });
  }
}

// 상품 금액 총 합계
function sumPrice() {
  if (!savedProducts) {
    TOTAL_PRICE = 0;
  }
  TOTAL_PRICE = products
    .map(({ product, count }) =>
      product.sale.onSale
        ? product.sale.discountedPrice * count
        : product.price * count
    )
    .reduce((acc, cur) => acc + cur, 0)
    .toLocaleString();
  totalPriceTxt.innerText = TOTAL_PRICE;
}

const emptyCartMessage = document.getElementById("emptyCartMessage");

// localStorage에 저장된 상품이 있을 때만 get 요청 실행
if (savedProducts) {
  cartOrOrderPage === "cart" && emptyCartMessage.classList.add("hidden");

  savedProducts.forEach(async (product, index) => {
    const result = await Api.get("/api/products", product.id);
    saveProduct(result, product.count, index);
  });
}

// cart 페이지일 때
if (cartOrOrderPage === "cart") {
  deleteAllButton.addEventListener("click", deleteAllProduct);
  orderButton.addEventListener("click", () => {
    // 장바구니가 비어있으면 alert
    if (!savedProducts) {
      alert("장바구니가 비어있습니다.");
      return;
    }
    // token이 없으면 login 페이지로 redirect
    if (!sessionStorage["token"]) {
      window.location.href = "/login";
      return;
    }
    window.location.href = "/order";
  });
  // 장바구니 비어있을 때
  if (!savedProducts) {
    emptyCartMessage.classList.remove("hidden");
  }
}

deleteSelectedButton.addEventListener("click", deleteSelectedProduct);
