import * as Api from "./api.js";

const cartProductList = document.getElementById("cartProductList");
const deleteSelectedButton = document.getElementById("deleteSelectedButton");
const totalPriceTxt = document.getElementById("totalPrice");

let products = []; // 상품 전체 정보가 담김
const savedProducts = JSON.parse(localStorage.getItem("products")); // [id, count]
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

// products배열에 저장 => 로컬스토리지 저장(saveProductsToLocalStorage) 및 dom에 추가(printProduct, sumPrice)
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
  // localstorage에 선택항목 삭제된 배열 저장 [id, count]
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
  sumPrice(products);
}

// dom에 장바구니 항목 추가
function printProduct(product, count, index) {
  const tr = document.createElement("tr");

  tr.className = "product";
  tr.innerHTML = `<td class="check-box-td"><input type="checkbox" class="check-box" data-product-id="${
    product._id
  }"/></td>
  <td class="product-name has-text-left"><img src="${
    product.image.path
  }" alt="${product.title}"/><div><a href="/product/${
    product._id
  }" class="mb-2">${
    product.title
  }</a><p>${product.price.toLocaleString()}원</p></div>
  </td>
    <td class="product-quantity">${count}</td>
    <td class="product-total-price" id="totalPrice${index}">${(
    product.price * count
  ).toLocaleString()}원</td>
  `;

  cartProductList.appendChild(tr);
}

// 상품 금액 총 합계
function sumPrice() {
  if (savedProducts.length < 1) {
    TOTAL_PRICE = 0;
  }
  TOTAL_PRICE = products
    .map(({ product, count }) => product.price * count)
    .reduce((acc, cur) => acc + cur, 0)
    .toLocaleString();
  totalPriceTxt.innerText = TOTAL_PRICE;
}

// localStorage에 저장된 상품이 있을 때만 get 요청 실행
if (savedProducts) {
  savedProducts.forEach(async (product, index) => {
    const result = await Api.get("/api/products", product.id);
    saveProduct(result, product.count, index);
  });
}

deleteSelectedButton.addEventListener("click", deleteSelectedProduct);
