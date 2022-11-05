const orderDate = document.getElementById("orderDate");
const orderReciptId = document.getElementById("orderReciptId");
const shippingStatus = document.getElementById("shippingStatus");
const quantity = document.getElementById("quantity");

const tableBody = document.getElementById("tableBody");
const tableHead = document.getElementById("tableHead");

fetch("http://localhost:4000/orders")
  .then((res) => res.json())
  .then((data) => {
    data.forEach((item) => {
      console.log(item);

      let itemData = `
      <tr>
        <td id="orderDate">${item.timestamps}</td>
        <td id="orderedProduct">
          <a href="#"><span id="orderReciptId">${item.products[0].productId}</span></a>
        </td>
        <td><span id="shippingStatus">${item.status}</span></td>
        <td id="quantity">${item.products[0].quantity}</td>
      </tr>
      `;

      tableBody.innerHTML += itemData;
    });
  })
  .catch((err) => console.log("Error : ", err));

/**
       * <tr>
        <td id="orderDate">2022-10-10</td>
        <td id="orderedProduct">
          <a href="#"><span id="orderReciptId">주문서 id</span></a>
        </td>
        <td><span id="shippingStatus">배송 상태</span></td>
        <td id="quantity">1</td>
      </tr>
       */
