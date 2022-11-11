import * as Api from "./api.js";

const recipient = document.getElementById("name");
const postcode = document.getElementById("sample3_postcode");
const addressInput = document.getElementById("sample3_address");
const detailAddress = document.getElementById("sample3_detailAddress");
const firstPhoneNumber = document.getElementById("firstPhoneNumber");
const middlePhoneNumber = document.getElementById("middlePhoneNumber");
const lastPhoneNumber = document.getElementById("lastPhoneNumber");
const payButton = document.getElementById("payButton");
const inputs = document.querySelectorAll("table input");

// 배송 정보 submit
function submitOrderInfo() {
  let products = JSON.parse(localStorage.getItem("products"));

  // localstorage 비었을 경우 에러 발생
  if (!products) {
    throw new Error("주문할 상품이 없습니다.");
  }

  // {id: , count: } => {product: , count: }로 바꿔줌
  products = products.map((product) => {
    return { product: product.id, count: product.count };
  });

  // 배송 정보
  const orderInfo = {
    recipient: recipient.value,
    phoneNumber: `${firstPhoneNumber.value}-${middlePhoneNumber.value}-${lastPhoneNumber.value}`,
    shippingAddress: {
      postalCode: postcode.value,
      address1: addressInput.value,
      address2: `${detailAddress.value}`,
    },
    products,
  };

  return orderInfo;
}

// 유저 정보 받아서 input에 자동 입력해줌
async function getUserInfo() {
  try {
    const user = await Api.get("/api/users/userInfo");

    if (!user) {
      throw new Error("유저 정보가 없습니다.");
    }

    const { fullName, phoneNumber, address } = user;

    recipient.value = fullName;
    postcode.value = address.postalCode;
    addressInput.value = address.address1;
    detailAddress.value = address.address2;
    middlePhoneNumber.value = phoneNumber.split("-")[1];
    lastPhoneNumber.value = phoneNumber.split("-")[2];
    for (let i = 0; i < firstPhoneNumber.length; i++) {
      if (firstPhoneNumber.options[i].value === phoneNumber.split("-")[0]) {
        firstPhoneNumber.options[i].selected = true;
      }
    }
  } catch (err) {
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

// 주문 post 요청
async function createOrder(e) {
  e.preventDefault();
  try {
    const orderInfo = submitOrderInfo();
    inputs.forEach((input) => {
      if (input.value === "") {
        throw new Error("배송 정보를 모두 채워주세요.");
      }
    });

    if (orderInfo.products.length < 1) {
      window.location.replace("/cart");
      throw new Error("주문할 상품이 없습니다.");
    }

    await Api.post("/api/orders", orderInfo);
    window.location.replace("/orderSuccess");
    localStorage.removeItem("products");
  } catch (err) {
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

getUserInfo();
payButton.addEventListener("click", createOrder);
