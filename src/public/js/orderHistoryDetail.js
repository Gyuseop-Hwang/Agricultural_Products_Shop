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
      //const totalPrice = item.totalPrice.toLocaleString("ko-KR");

      item.products.forEach((product) => {
        const productImage = product.product.image.path;
        const productQuantity = product.product.quantity;
        const productTitle = product.product.title;
        const productPrice = product.product.price.toLocaleString("ko-KR");

        let itemData = `
      <tr>
        <td id="tableData">
          <img src="${productImage}" id="productImage" alt="productImage">
          <span id="productTitle">${productTitle}</span>
        </td>
        <td id="productQuantity">
          <span id="quantity">${productQuantity}</span>
        </td>
        <td id="productPrice">
          <span id="price">${productPrice} 원</span>
        </td>
      </tr>
      `;
        tableBody.innerHTML += itemData;
      });
    });
  })
  .catch((err) => console.log("Error : ", err));
