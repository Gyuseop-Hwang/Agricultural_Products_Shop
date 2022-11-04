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
function saveProduct(product, count, index) {
  const newProductObj = { product, count };
  for (let i = 0; i < products.length; i++) {
    if (products[i].product === newProductObj.product) {
      products[i] = newProductObj;
      const totalPrice = document.getElementById(`totalPrice${index}`);
      totalPrice.innerText = `${(product.price * count).toLocaleString()}원`;
      saveToLocalStorage(products);
      return;
    }
  }
  products.push(newProductObj);
  saveToLocalStorage(products);
  paintProduct(product, count, index);
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

  // localstorage에 선택항목 삭제된 배열 저장
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
  sumPrice(products);
}

// dom에 장바구니 항목 추가
function paintProduct(product, count, index) {
  const tr = document.createElement("tr");

  tr.className = "product";
  tr.innerHTML = `<td><input type="checkbox" class="check-box" data-product-id="${
    product._id
  }"/></td>
    <td>이미지 추후 삽입</td>
    <td class="product-name has-text-left">${product.title}</td>
    <td class="product-price">${product.price.toLocaleString()}원</td>
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

// localStorage에 저장된 상품이 있을 때
if (savedProducts) {
  savedProducts.forEach(async (product, index) => {
    const result = await Api.get("/api/products", product.id);
    saveProduct(result, product.count, index);
  });
}

deleteSelectedButton.addEventListener("click", deleteSelectedProduct);
