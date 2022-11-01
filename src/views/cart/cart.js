const cartProductList = document.getElementById("cartProductList");
const deleteSelectedButton = document.getElementById("deleteSelectedButton");
const deleteAllButton = document.getElementById("deleteAllButton");

let products = [];

function saveProduct(newProducts) {
  localStorage.setItem("products", JSON.stringify(newProducts));
}

function deleteSelectedProduct() {
  const checkBoxes = document.querySelectorAll(".checkBox");
  let newProducts = [];

  // dom에서 선택항목 삭제
  for (let i = 0; i < checkBoxes.length; i++) {
    if (checkBoxes[i].checked === true) {
      checkBoxes[i].parentElement.parentElement.remove();
    }
  }

  // localstorage에 선택항목 삭제된 배열 저장
  newProducts = products.filter((product) => {
    for (let i = 0; i < checkBoxes.length; i++) {
      if (checkBoxes[i].checked !== true && checkBoxes[i].id === product.id) {
        return true;
      }
    }
  });

  saveProduct(newProducts);
}

function paintProduct(product) {
  const tr = document.createElement("tr");
  tr.innerHTML = `<td><input type="checkbox" class="checkBox" id="${product.id}"/></td>
    <td>${product.name}</td>
    <td>${product.price}</td>
    <td><input type="number" value="${product.count}" /></td>
  `;
  cartProductList.appendChild(tr);
}

deleteSelectedButton.addEventListener("click", deleteSelectedProduct);

// localStorage에 저장된 상품이 있을 때
const savedProducts = localStorage.getItem("products");
if (savedProducts) {
  products = JSON.parse(savedProducts);
  products.forEach(paintProduct);
}

// 장바구니 비어있을 때
if (products.length < 1) {
}
