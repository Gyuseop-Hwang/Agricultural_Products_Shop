const orderList = document.getElementById("orderList");

// 삭제, 상태 수정 코드 추가해야 함
// 받아온 주문내역 화면에 보여줌, ejs로 추후 수정
async function paintOrders(order) {
  const {
    id,
    products,
    phoneNumber,
    recipient,
    shippringAddress,
    status,
    totalPrice,
    userId,
  } = order;

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

// 패치 함수
async function fetchData() {
  const response = await fetch("http://localhost:3001/data");
  const result = await response.json();

  return result;
}

// 데이터 받아옴
async function getOrders() {
  const orders = await fetchData();
  console.log(orders);
  orders.forEach(paintOrders);
}

getOrders();
