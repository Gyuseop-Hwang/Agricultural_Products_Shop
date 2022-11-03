import * as Api from "/api.js";

const recipient = document.getElementById("name");
const postcode = document.getElementById("sample3_postcode");
const address = document.getElementById("sample3_address");
const detailAddress = document.getElementById("sample3_detailAddress");
const extraAddress = document.getElementById("sample3_extraAddress");
const firstPhoneNumber = document.getElementById("firstPhoneNumber");
const middlePhoneNumber = document.getElementById("middlePhoneNumber");
const lastPhoneNumber = document.getElementById("lastPhoneNumber");
const payButton = document.getElementById("payButton");

function submitOrderInfo() {
  let products = JSON.parse(localStorage.getItem("products"));
  products = products.map((product) => {
    return { productId: product.id, quantity: product.count };
  });

  const orderInfo = {
    recipient: recipient.value, //받는 사람
    phoneNumber: `${firstPhoneNumber.value}-${middlePhoneNumber.value}-${lastPhoneNumber.value}`, // 전화번호
    shippingAddress: `${postcode.value} ${address.value} ${detailAddress.value} ${extraAddress.value}`, // 주소
    products, // 상품
    userId: sessionStorage["token"], // user token
  };

  return orderInfo;
}

async function createOrder() {
  try {
    const orderInfo = submitOrderInfo();
    console.log(orderInfo.products);
    if (orderInfo.products.length < 1) {
      //장바구니 리다이렉트
      //window.location.href("");
      throw new Error("주문할 상품이 없습니다.");
    }
    await Api.post("/api/orders", orderInfo);
    localStorage.clear();
    // 주문성공페이지 리다이렉트
    // window.location.href("")
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

payButton.addEventListener("click", createOrder);
