const orderDate = document.getElementById("orderDate");
const orderReciptId = document.getElementById("orderReciptId");
const shippingStatus = document.getElementById("shippingStatus");
const quantity = document.getElementById("quantity");

const tableBody = document.getElementById("tableBody");
const tableHead = document.getElementById("tableHead");

const usersToken = sessionStorage.getItem("token");

fetch("http://localhost:5500/api/orders", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${usersToken}`,
  },
})
  .then((res) => res.json())
  .then((data) => {
    data.forEach((item) => {
      let date = item.createdAt.slice(0, 10);

      let totalPrice = item.totalPrice.toLocaleString("ko-KR");

      let itemData = `
      <tr>
        <td id="orderDate">${date}</td>
        <td id="orderedProduct">
          <a href="/orderHistoryDetail"><span id="orderReciptId">${item._id}</span></a>
        </td>
        <td><span id="shippingStatus">${item.status}</span></td>
        <td id="totalPrice">${totalPrice}</td>
      </tr>
      `;

      tableBody.innerHTML += itemData;
    });
  })
  .catch((err) => console.log("Error : ", err));
