import * as Api from "/api.js";
const orderList = document.getElementById("orderList");

// 삭제, 상태 수정 코드 추가해야 함
// 받아온 주문내역 화면에 보여줌, ejs로 추후 수정
function paintOrders(order, index) {
  const {
    _id,
    products,
    phoneNumber,
    recipient,
    shippingAddress,
    status,
    totalPrice,
    userId,
  } = order;

  const tr = document.createElement("tr");
  tr.className = "order";
  tr.innerHTML = `<td>2022/10/11</td>
  <td>${userId}</td>
  <td>
  ${products
    .map((product) => `<p>${product.productId} * ${product.quantity}</p>`)
    .join("")}
  </td>
  <td>{totalPrice.toLocaleString()}원</td>
  <td>
    <p>${recipient}</p>
    <p>${shippingAddress}</p>
    <p>${phoneNumber}</p>
  </td>
  <td>
    <select class="select is-small" id="statusSelect${index}">
      <option value="주문 완료" selected>주문 완료</option>
      <option value="배송 준비중">배송 준비중</option>
      <option value="배송중">배송중</option>
      <option value="배송 완료">배송 완료</option>
    </select>
    <button class="button is-small" id="modifyStatusBtn${index}">수정</button>
  </td>
  <td>
    <button class="button is-small" id="cancleOrderBtn${index}">주문삭제</button>
  </td>`;
  orderList.appendChild(tr);

  // 주문 삭제
  const cancleOrderBtn = document.getElementById(`cancleOrderBtn${index}`);
  cancleOrderBtn.addEventListener("click", () => {
    deleteOrder(_id);
    tr.remove();
  });
  // 배송 상태 변경
  const modifyStatusBtn = document.getElementById(`modifyStatusBtn${index}`);
  modifyStatusBtn.addEventListener("click", () => {
    const selectBox = document.getElementById(`statusSelect${index}`);
    const selectedStatus = selectBox.options[selectBox.selectedIndex].text;

    updateOrderStatus(_id, { status: selectedStatus });
  });
}

// 배송 상태 변경
async function updateOrderStatus(id, status) {
  try {
    const bodyData = JSON.stringify(status);
    const result = await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: bodyData,
    });

    //Api.patch(`/api/admin/orders`, id, { status: status });
    console.log(result);
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

// 주문 삭제
async function deleteOrder(id) {
  try {
    const result = await Api.delete("/api/orders", id);
    console.log(result);
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

// 전체 주문 내역 가져오기
async function getOrders() {
  try {
    const result = await Api.get("/api/admin/orders");
    result.forEach((order, index) => paintOrders(order, index));
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

getOrders();
