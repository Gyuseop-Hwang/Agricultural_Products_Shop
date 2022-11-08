import * as Api from "./api.js";

const recipient = document.getElementById("name");
const postcode = document.getElementById("sample3_postcode");
const address = document.getElementById("sample3_address");
const detailAddress = document.getElementById("sample3_detailAddress");
const firstPhoneNumber = document.getElementById("firstPhoneNumber");
const middlePhoneNumber = document.getElementById("middlePhoneNumber");
const lastPhoneNumber = document.getElementById("lastPhoneNumber");
const payButton = document.getElementById("payButton");

// 배송 정보 submit
function submitOrderInfo() {
  let products = JSON.parse(localStorage.getItem("products"));

  // localstorage 비었을 경우 에러 발생
  if (!products) {
    throw new Error("주문할 상품이 없습니다.");
  }

  // 객체 키를 id => product로 바꿔줌
  products = products.map((product) => {
    return { product: product.id, count: product.count };
  });

  const orderInfo = {
    recipient: recipient.value, //받는 사람
    phoneNumber: `${firstPhoneNumber.value}-${middlePhoneNumber.value}-${lastPhoneNumber.value}`, // 전화번호
    shippingAddress: {
      postalCode: postcode.value,
      address1: address.value,
      address2: `${detailAddress.value}`,
    }, // 주소
    products, // 상품
  };

  return orderInfo;
}

// 유저 정보 받아서 input에 자동 입력해줌
async function getUserInfo() {
  try {
    const user = await Api.get("/api/users/userInfo");

    if (!user) {
      return;
    }

    const { fullName, phoneNumber, address } = user;
    recipient.value = fullName;
    postcode.value = address.postalCode;
    address.value = address.address1;
    detailAddress.value = address.address2;
    middlePhoneNumber.value = phoneNumber.split("-")[1];
    lastPhoneNumber.value = phoneNumber.split("-")[2];

    for (let i = 0; i < firstPhoneNumber.length; i++) {
      if (firstPhoneNumber.options[i].value === phoneNumber.split("-")[0]) {
        firstPhoneNumber.options[i].selected = true;
      }
    }
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

async function createOrder() {
  try {
    const orderInfo = submitOrderInfo();
    console.log(orderInfo.products);
    if (orderInfo.products.length < 1) {
      //장바구니 리다이렉트
      window.location.replace("/cart");
      throw new Error("주문할 상품이 없습니다.");
    }
    await Api.post("/api/orders", orderInfo);
    //주문성공페이지 리다이렉트
    window.location.replace("/orderSuccess");
    localStorage.clear();
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

getUserInfo();
payButton.addEventListener("click", createOrder);
