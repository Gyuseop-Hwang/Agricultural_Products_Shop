import * as Api from "/api.js";

const cartProductList = document.getElementById("cartProductList");
const deleteSelectedButton = document.getElementById("deleteSelectedButton");
const deleteAllButton = document.getElementById("deleteAllButton");
const totalPriceTxt = document.getElementById("totalPrice");

let products = [];
const savedProducts = JSON.parse(localStorage.getItem("products"));
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

// products배열에 저장 => 로컬스토리지 저장(saveProductsToLocalStorage) 및 dom에 추가(paintProduct, sumPrice)
function saveProduct(product, count) {
  const newProductObj = { product, count };
  for (let i = 0; i < products.length; i++) {
    if (products[i].product === newProductObj.product) {
      products[i] = newProductObj;
      saveToLocalStorage(products);
      return;
    }
  }
  products.push(newProductObj);
  saveToLocalStorage(products);
  paintProduct(product, count);
  sumPrice();
}

function deleteSelectedProduct() {
  const checkBoxes = document.querySelectorAll(".check-box");
  // dom에서 선택항목 삭제
  for (let i = 0; i < checkBoxes.length; i++) {
    if (checkBoxes[i].checked === true) {
      checkBoxes[i].parentElement.parentElement.remove();
    }
  }
  //localstorage에 선택항목 삭제된 배열 저장
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

  saveToLocalStorage(newProducts);
  if (newProducts.length < 1) {
    emptyCartMessage.classList.remove("hidden");
  }

  sumPrice(products);
}

function deleteAllProduct() {
  // dom에서 전체 삭제
  const allProduct = document.querySelectorAll(".product");
  allProduct.forEach((product) => product.remove());
  emptyCartMessage.classList.remove("hidden");
  // localstorage에 빈 배열 저장
  const emptyCart = [];
  localStorage.setItem("products", emptyCart);
  products = emptyCart;
  sumPrice();
}

// dom에 장바구니 항목 추가
// 상품 링크 추가해야 함
function paintProduct(product, count) {
  const tr = document.createElement("tr");

  tr.className = "product";
  tr.innerHTML = `<td><input type="checkbox" class="check-box" data-product-id="${
    product._id
  }"/></td>
    <td>이미지 추후 삽입</td>
    <td class="product-name has-text-left"><p>${product.title}</p></td>
    <td class="product-price ${product._id}" data-price="${
    product.price
  }">${product.price.toLocaleString()}원</td>
    <td class="product-quantity"><input type="number" class="number-input ${
      product._id
    }"  value="${count}" min="1"/><button class="change-count-button" data-product-id="${
    product._id
  }">변경</button></td>
    <td class="product-total-price ${product._id}">${(
    product.price * count
  ).toLocaleString()}원</td>
  `;

  cartProductList.appendChild(tr);

  // 수량 변경 이벤트 추가
  const changeCountButtons = document.querySelectorAll(".change-count-button");
  const numberInput = document.getElementsByClassName(
    `number-input ${product._id}`
  );

  changeCountButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // 에러 수정해야함
      saveProduct(product, numberInput[0].value);
      sumPrice();
    });
  });
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

const emptyCartMessage = document.getElementById("emptyCartMessage");

// localStorage에 저장된 상품이 있을 때
if (savedProducts) {
  emptyCartMessage.classList.add("hidden");
  savedProducts.forEach(async (product) => {
    const result = await Api.get(
      "http://localhost:5500/api/products",
      product.id
    );
    saveProduct(result, product.count);
  });
}

// 장바구니 비어있을 때
if (savedProducts.length < 1) {
  emptyCartMessage.classList.remove("hidden");
}

deleteSelectedButton.addEventListener("click", deleteSelectedProduct);
deleteAllButton.addEventListener("click", deleteAllProduct);
