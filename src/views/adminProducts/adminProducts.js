import * as Api from "/api.js";

const productTable = document.getElementById("productListTable");

// 전체 상품 출력
function printAllProducts(product, index) {
  console.log(product);
  const { _id: id, category, image, title, price, quantity } = product;
  const tr = document.createElement("tr");
  tr.innerHTML = `<tr>
  <td>${category.name}</td>
  <td><img class="product-image" src="${image.path}" /></td>
  <td>${title}</td>
  <td>${price}</td>
  <td>${quantity}</td>
  <td><a href="/adminProducts/${id}"><button class="button is-small">수정</button></a></td>
  <td><button class="button is-small" id="deleteButton${index}">삭제</button></a></td>
</tr>`;
  productTable.appendChild(tr);

  const deleteButton = document.getElementById(`deleteButton${index}`);
  deleteButton.addEventListener("click", () => {
    deleteProduct(id);
    tr.remove();
  });
}

// 전체 상품 get 요청
async function getAllProducts() {
  try {
    const { categories, products } = await Api.get("/api/products");
    products.forEach((product, index) => printAllProducts(product, index));
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

async function deleteProduct(id) {
  try {
    await Api.delete("/api/admin/products", id);
    alert("삭제되었습니다.");
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

getAllProducts();
