import * as Api from "./api.js";
import { showModal, addModalEvent } from "./modal.js";

const deleteButtons = document.querySelectorAll(".deleteButton");
const trs = document.querySelectorAll(".tr");

let PRODUCT_ID;

deleteButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    PRODUCT_ID = e.currentTarget.dataset.id;
    showModal("상품 삭제", "상품을 삭제하시겠습니까?");
  });
});
addModalEvent(() => {
  deleteProduct(PRODUCT_ID);
  trs.forEach((tr) => {
    if (tr.dataset.id === PRODUCT_ID) {
      tr.remove();
    }
  });
});
// 삭제 버튼 이벤트 등록
function clickDeleteButton(productId) {
  deleteProduct(productId);
}

// 전체 상품 get 요청
async function getAllProducts() {
  try {
    const { categories, products } = await Api.get("/api/products");
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
