const recipient = document.getElementById("name");
const postcode = document.getElementById("sample3_postcode");
const address = document.getElementById("sample3_address");
const detailAddress = document.getElementById("sample3_detailAddress");
const extraAddress = document.getElementById("sample3_extraAddress");
const firstPhoneNumber = document.getElementById("firstPhoneNumber");
const middlePhoneNumber = document.getElementById("middlePhoneNumber");
const lastPhoneNumber = document.getElementById("lastPhoneNumber");
const payButton = document.getElementById("payButton");

function getOrderInfo() {
  let products = JSON.parse(localStorage.getItem("products"));
  products = products.map((product) => {
    return { productId: product.id, quantity: product.quantity };
  });
  console.log(products);
  const orderInfo = {
    recipient: recipient.value, //받는 사람
    phoneNumber: `${firstPhoneNumber.value}-${middlePhoneNumber.value}-${lastPhoneNumber.value}`, // 전화번호
    shippingAddress: `${postcode.value} ${address.value} ${detailAddress.value} ${extraAddress.value}`, // 주소
    products, // 상품
    userId: "",
  };

  console.log(orderInfo);
}

payButton.addEventListener("click", getOrderInfo);
