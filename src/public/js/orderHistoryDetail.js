const orderDate = document.getElementById("orderDate");
const orderReciptId = document.getElementById("orderReciptId");
const shippingStatus = document.getElementById("shippingStatus");
const quantity = document.getElementById("quantity");

const tableBody = document.getElementById("tableBody");
const tableHead = document.getElementById("tableHead");

const usersToken = sessionStorage.getItem("token");

const path = location.pathname.split("/")[2];

fetch(`/api/orders/${path}`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${usersToken}`,
  },
})
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    data.products.forEach((item) => {
      const productImage = item.product.image.path;
      const productQuantity = item.count;
      const productTitle = item.product.title;
      const productPrice = item.product.price.toLocaleString("ko-KR");

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
  })
  .catch((err) => console.error("Error : ", err));
console.log(location.pathname);
