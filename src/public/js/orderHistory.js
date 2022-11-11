const orderDate = document.getElementById("orderDate");
const orderReciptId = document.getElementById("orderReciptId");
const shippingStatus = document.getElementById("shippingStatus");
const quantity = document.getElementById("quantity");

const tableBody = document.getElementById("tableBody");
const tableHead = document.getElementById("tableHead");

const usersToken = sessionStorage.getItem("token");

fetch("/api/orders", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${usersToken}`,
  },
})
  .then((res) => res.json())
  .then((data) => {
    if (JSON.stringify(data) === "{}") return;
    data.forEach((item) => {
      const date = item.createdAt.slice(0, 10);

      const totalPrice = item.totalPrice.toLocaleString("ko-KR");

      let itemData = `
      <tr>
        <td id="orderDate">${date}</td>
        <td id="orderedProduct">
          <a href="/orderHistoryDetail/${item._id}"><span id="orderReciptId">${item._id}</span></a>
        </td>
        <td><span id="shippingStatus">${item.status}</span></td>
        <td id="totalPrice">${totalPrice} 원</td>
      </tr>
      `;

      tableBody.innerHTML += itemData;
    });
  })
  .catch((err) => console.error("Error : ", err));
