import * as Api from "./api.js";
import { showModal, addModalEvent } from "./modal.js";

const deleteButtons = document.querySelectorAll(".deleteButton");
const trs = document.querySelectorAll(".tr");

let PRODUCT_ID;

// 할인 금액 print
function printDiscountedPrice(products) {
  const discountedProducts = products.filter((product) => product.sale.onSale);
  discountedProducts.forEach((product) => {
    const priceTd = document.getElementById(`price${product._id}`);
    const priceSpan = document.querySelector(`#price${product._id} span`);
    priceTd.prepend(`${product.sale.discountedPrice.toLocaleString()}원`);
    priceSpan.className = "discount-price";
  });
}

// 삭제버튼 클릭시 모달 나타남
deleteButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    PRODUCT_ID = e.currentTarget.dataset.id;
    showModal("상품 삭제", "상품을 삭제하시겠습니까?");
  });
});
// 모달 yes 클릭시 발생하는 이벤트
addModalEvent(() => {
  deleteProduct(PRODUCT_ID);
  trs.forEach((tr) => {
    if (tr.dataset.id === PRODUCT_ID) {
      tr.remove();
    }
  });
});

// 전체 상품 get 요청
async function getAllProducts() {
  try {
    const { products } = await Api.get("/api/products");
    printDiscountedPrice(products);
  } catch (err) {
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

async function deleteProduct(id) {
  try {
    await Api.delete("/api/admin/products", id);
    alert("삭제되었습니다.");
  } catch (err) {
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

getAllProducts();
