const cartProductList = document.getElementById("cartProductList");
const totalPriceTxt = document.getElementById("totalPrice");
const deleteSelectedButton = document.getElementById("deleteSelectedButton");

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
        checkBoxes[i].dataset.productId === product._id.$oid
      ) {
        return true;
      }
    }
  });

  saveProduct(newProducts);
  sumPrice(newProducts);
}

function paintProduct(product) {
  const tr = document.createElement("tr");
  tr.className = "product";
  tr.innerHTML = `<td><input type="checkbox" class="check-box" data-product-id="${
    product._id.$oid
  }"/></td>
    <td>이미지 추후 삽입</td>
    <td class="product-name has-text-left"><p>${product.name}</p></td>
    <td class="product-price ${product._id.$oid}" data-price="${
    product.price
  }">${product.price.toLocaleString()}원</td>
    <td class="product-quantity">${product.quantity}</td>
    <td class="product-total-price ${product._id.$oid}">${(
    product.price * product.quantity
  ).toLocaleString()}원</td>
  `;
  cartProductList.appendChild(tr);
}

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

const savedProducts = localStorage.getItem("products");

if (savedProducts) {
  products = JSON.parse(savedProducts);
  products.forEach(paintProduct);
  sumPrice(products);
}

deleteSelectedButton.addEventListener("click", deleteSelectedProduct);
