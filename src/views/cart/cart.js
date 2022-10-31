const cartProductList = document.getElementById("cartProductList");
const deleteSelectedButton = document.getElementById("deleteSelectedButton");
const deleteAllButton = document.getElementById("deleteAllButton");

let products = localStorage.getItem("products");
let isCheckedArray = [];

function saveProduct() {
  localStorage.setItem("products", JSON.stringify(products));

  // backend로 요청 보내기
}

function deleteProduct() {
  deleteProduct = isCheckedArray.map((ele) => {
    return ele.id;
  });
  //삭제 코드 구현해야 함

  saveProduct();
}

function paintProduct(product) {
  const tr = document.createElement("tr");

  tr.innerHTML = `<td>
  <input type="checkbox" class="checkBox" id="${product.id}"/>
  </td>
  <td>${product.name}</td>
  <td>${product.price}</td>
  <td><input type="number" value="${product.count}" /></td>
  `;

  cartProductList.appendChild(tr);
}

deleteSelectedButton.addEventListener("click", deleteProduct);

saveProduct();

// localStorage에 저장된 상품이 있을 때
if (products) {
  const parsedProducts = JSON.parse(products);
  products = parsedProducts;
  products.forEach(paintProduct);
}

// 장바구니 비어있을 때
if (products.length < 1) {
}

// check된 product의 id 가져오기
const checkBoxes = document.querySelectorAll(".checkBox");

checkBoxes.forEach((checkBox) => {
  checkBox.addEventListener("change", () => {
    if (checkBox.checked) {
      isCheckedArray.push(checkBox);
    }
    isCheckedArray = isCheckedArray.filter(
      (checkBox) => checkBox.checked === true
    );
    console.log(isCheckedArray);
  });
});
