import * as Api from "./api.js";

// 삭제 버튼 이벤트 등록
function clickDeleteButton(product, index) {
  const deleteButton = document.getElementById(`deleteButton${index}`);

  const tr = document.getElementById(`tr${index}`);
  deleteButton.addEventListener("click", () => {
    deleteProduct(product._id);
    tr.remove();
  });
}

// 전체 상품 get 요청
async function getAllProducts() {
  try {
    const { categories, products } = await Api.get("/api/products");
    products.forEach((product, index) => clickDeleteButton(product, index));
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
