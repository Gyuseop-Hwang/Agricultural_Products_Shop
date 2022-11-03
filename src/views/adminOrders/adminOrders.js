import * as Api from "/api.js";
const orderList = document.getElementById("orderList");

// 삭제, 상태 수정 코드 추가해야 함
// 받아온 주문내역 화면에 보여줌, ejs로 추후 수정
function paintOrders(order) {
  // const {
  //   //id 받아와야됨
  //   products,
  //   phoneNumber,
  //   recipient,
  //   shippringAddress,
  //   status,
  //   totalPrice,
  //   userId,
  // } = order;

  const tr = document.createElement("tr");
  tr.className = "order";
  tr.innerHTML = `<td>2022/10/11</td>
  <td>${userId}}</td>
  <td>
  ${products
    .map((product) => `<p>${product.product} * ${product.quantity}</p>`)
    .join("")}
  </td>
  <td>${totalPrice.toLocaleString()}원</td>
  <td>
    <p>${recipient}</p>
    <p>${shippringAddress}</p>
    <p>${phoneNumber}</p>
  </td>
  <td>
    <select class="select is-small" name="" id=""">
      <option value="" selected>배송준비중</option>
      <option value="">배송중</option>
      <option value="">배송완료</option>
    </select>
    <button class="button is-small" id="modifyStatusBtn">수정</button>
  </td>
  <td>
    <button class="button is-small" id="cancleOrderBtn">주문취소</button>
  </td>`;
  orderList.appendChild(tr);
}

// 배송 상태 변경
async function updateOrderStatus(id, status) {
  try {
    const result = await Api.put(
      `http://localhost:5500/api/orders/${id}`,
      status
    );
    console.log(result);
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

// 주문 삭제
async function deleteOrder(id) {
  try {
    const result = await Api.delete("http://localhost:5500/api/orders", id);
    console.log(result);
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

// 전체 주문 내역 가져오기
async function getOrders() {
  try {
    const result = await Api.get("http://localhost:5500/api/orders");
    console.log(result);
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

getOrders();
