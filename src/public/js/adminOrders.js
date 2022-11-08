import * as Api from "./api.js";
import { showModal, addModalEvent } from "./modal.js";
const orderList = document.getElementById("orderList");

const deleteOrderButton = document.querySelectorAll(".delete-button");
const trs = document.querySelectorAll(".tr");
let ORDER_ID;

deleteOrderButton.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    ORDER_ID = e.currentTarget.dataset.id;
    showModal("주문 삭제", "해당 주문을 삭제하시겠습니까?");
  });
});
addModalEvent(() => {
  deleteOrder(ORDER_ID);
  trs.forEach((tr) => {
    if (tr.dataset.id === ORDER_ID) {
      tr.remove();
    }
  });
});

// 받아온 주문내역 중 주문일자, 배송상태 출력 및 삭제, 수정 이벤트 등록
function printOrders(order, index) {
  const { _id, createdAt, status } = order;

  // 주문일자 출력
  const orderDate = document.querySelector(`.createdAt${index}`);
  orderDate.innerText = createdAt.substring(0, 10);

  // 배송상태 출력
  const statusSelect = document.getElementById(`statusSelect${index}`);
  for (let i = 0; i < statusSelect.length; i++) {
    if (statusSelect.options[i].value === status) {
      statusSelect.options[i].selected = true;
    }
  }

  // 배송 상태 업데이트 핸들러
  const modifyStatusBtn = document.getElementById(`modifyStatusBtn${index}`);
  modifyStatusBtn.addEventListener("click", () => {
    const selectBox = document.getElementById(`statusSelect${index}`);
    const selectedStatus = selectBox.options[selectBox.selectedIndex].text;

    updateOrderStatus(_id, { status: selectedStatus });
  });
}

// 배송 상태 업데이트
async function updateOrderStatus(id, status) {
  try {
    await Api.put("/api/admin/orders", id, status);
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

// 주문 삭제
async function deleteOrder(id) {
  try {
    await Api.delete("/api/admin/orders", id);
    alert("삭제되었습니다.");
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

// 전체 주문 내역 가져오기
async function getOrders() {
  try {
    const result = await Api.get("/api/admin/orders");
    result.forEach((order, index) => printOrders(order, index));
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

getOrders();
