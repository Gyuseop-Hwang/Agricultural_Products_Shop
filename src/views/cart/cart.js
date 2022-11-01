const cartProductList = document.getElementById("cartProductList");
const deleteSelectedButton = document.getElementById("deleteSelectedButton");
const deleteAllButton = document.getElementById("deleteAllButton");
const totalPriceTxt = document.getElementById("totalPrice");

let products = [];

let TOTAL_PRICE;

function saveProduct(newProducts) {
  localStorage.setItem("products", JSON.stringify(newProducts));
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
  const newProducts = products.filter((product) => {
    for (let i = 0; i < checkBoxes.length; i++) {
      if (
        checkBoxes[i].checked !== true &&
        checkBoxes[i].dataset.productId === product.id
      ) {
        return true;
      }
    }
  });
  saveProduct(newProducts);
  sumPrice(newProducts);
}

function deleteAllProduct() {
  // dom에서 전체 삭제
  const allProduct = document.querySelectorAll(".product");
  allProduct.forEach((product) => product.remove());
  // localstorage에 빈 배열 저장
  const emptyCart = [];
  saveProduct(emptyCart);
  sumPrice(emptyCart);
}

// 수량 변경
function changeQuantity(e) {
  const targetId = e.target.dataset.productId;
  const numberInput = document.getElementsByClassName(
    `number-input ${targetId}`
  );
  const changedQuantity = parseInt(numberInput[0].value);
  const newProducts = products.map((product) => {
    if (product.id === targetId) {
      product.quantity = changedQuantity;
    }
    return product;
  });

  const totalPrice = document.getElementsByClassName(
    `product-total-price ${targetId}`
  );
  const price = parseInt(
    document.getElementsByClassName(`product-price ${targetId}`)[0].dataset
      .price
  );

  totalPrice[0].innerText = `${(changedQuantity * price).toLocaleString()}원`;
  saveProduct(newProducts);
  sumPrice(newProducts);
}

// dom에 장바구니 항목 추가
// 상품 링크 추가해야 함
function paintProduct(product) {
  const tr = document.createElement("tr");
  tr.className = "product";
  tr.innerHTML = `<td><input type="checkbox" class="check-box" data-product-id="${
    product.id
  }"/></td>
    <td>이미지 추후 삽입</td>
    <td class="product-name"><p>${product.name}</p></td>
    <td class="product-price ${product.id}" data-price="${
    product.price
  }">${product.price.toLocaleString()}원</td>
    <td><input type="number" class="number-input ${product.id}"  value="${
    product.quantity
  }" /><button class="change-quantity-button" data-product-id="${
    product.id
  }">변경</button></td>
    <td class="product-total-price ${product.id}">${(
    product.price * product.quantity
  ).toLocaleString()}원</td>
  `;
  cartProductList.appendChild(tr);
}

// 상품 금액 총 합계
function sumPrice(newProducts) {
  if (newProducts.length < 1) {
    TOTAL_PRICE = 0;
  }
  TOTAL_PRICE = newProducts
    .map((product) => product.price * product.quantity)
    .reduce((acc, cur) => acc + cur, 0)
    .toLocaleString();
  totalPriceTxt.innerText = TOTAL_PRICE;
}

// localStorage에 저장된 상품이 있을 때
const savedProducts = localStorage.getItem("products");
if (savedProducts) {
  products = JSON.parse(savedProducts);
  products.forEach(paintProduct);
  sumPrice(products);
}

// 장바구니 비어있을 때
if (products.length < 1) {
}

deleteSelectedButton.addEventListener("click", deleteSelectedProduct);
deleteAllButton.addEventListener("click", deleteAllProduct);

const changeQuantityButton = document.querySelectorAll(
  ".change-quantity-button"
);
changeQuantityButton.forEach((button) =>
  button.addEventListener("click", changeQuantity)
);
