import { showModal, addModalEvent } from "/js/modal.js";

// 버튼
const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");

const email = document.getElementById("email");
const fullName = document.getElementById("name");
const password = document.getElementById("password");
const phone = document.getElementById("phone");

// 이메일 , 이름, 비밀번호, 전화번호, 주소 등 - 접속시 첫 화면에 나타나는 정보 텍스트
const emailText = document.getElementById("emailText");
const nameText = document.getElementById("nameText");
const passwordText = document.getElementById("passwordText");
const phoneText = document.getElementById("phoneText");
const postalCodeText = document.getElementById("postalCodeText");
const addressText = document.getElementById("addressText");
const detailAddressText = document.getElementById("detailAddressText");

const postalCodeLabel = document.getElementById("postalCodeLabel");
const addressLabel = document.getElementById("addressLabel");
const detailAddressLabel = document.getElementById("detailAddressLabel");

// 다음주소 API 주소 폼
const daumAddressText = document.getElementById("daumAddressText");
const sample6_postcode = document.getElementById("sample6_postcode");
const sample6_postcode_btn = document.getElementById("sample6_postcode_btn");
const sample6_address = document.getElementById("sample6_address");
const sample6_detailAddress = document.getElementById("sample6_detailAddress");
const sample6_extraAddress = document.getElementById("sample6_extraAddress");

// 비밀번호 확인
const conformPassword = document.getElementById("conformPassword");
const conformPasswordInput = document.getElementById("conformPasswordInput");

// 모달창 아니오 버튼 숨기기
const noButton = document.getElementById("noButton");
noButton.classList.add("is-invisible");

// 토큰 가져오기
const usersToken = sessionStorage.getItem("token");

fetch(`/api/users/userInfo`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${usersToken}`,
  },
})
  .then((res) => res.json())
  .then((data) => {
    emailText.innerHTML = data.email;
    nameText.innerHTML = data.fullName;
    phoneText.innerHTML = data.phoneNumber;
    passwordText.innerHTML = "********";
    postalCodeText.innerHTML = data.address.postalCode;
    addressText.innerHTML = data.address.address1;
    detailAddressText.innerHTML = data.address.address2;

    email.value = data.email;
    fullName.value = data.fullName;
    phone.value = data.phoneNumber;
    password.value = "";
    sample6_postcode.value = data.address.postalCode;
    sample6_address.value = data.address.address1;
    sample6_detailAddress.value = data.address.address2;
  })
  .catch((err) => {
    console.error("Error : ", err);
    window.location.href = "/errorPage";
  });

async function onClickEditBtn(e) {
  e.preventDefault();

  [
    email,
    fullName,
    password,
    phone,
    sample6_postcode,
    sample6_postcode_btn,
    sample6_address,
    sample6_detailAddress,
    sample6_extraAddress,
    daumAddressText,
    conformPassword,
    conformPasswordInput,
  ].forEach((item) => {
    item.classList.remove("hidden");
  });
  // 폼이 나타나게 함

  if (editBtn.innerText === "수정") {
    editBtn.innerText = "완료";

    [
      emailText,
      nameText,
      passwordText,
      phoneText,
      postalCodeText,
      addressText,
      detailAddressText,
      postalCodeLabel,
      addressLabel,
      detailAddressLabel,
    ].forEach((item) => {
      item.classList.add("hidden");
    });
    // 폼이 나타나게 함 (글씨 숨김) -> 첫페이지에선 보여야함.
  } else if (editBtn.innerText === "완료") {
    editBtn.innerText = "수정";

    let sign = conformPassword.value;

    // 완료 되었을 때의 기능을 추가 - 데이터 보내주기
    let data = {
      email: email.value,
      fullName: fullName.value,
      password: password.value,
      phone: phone.value,
      address: {
        postalCode: sample6_postcode.value,
        address1: sample6_address.value,
        address2: sample6_detailAddress.value,
      },
      currentPassword: String(sign),
    };

    // 끝부분에 식별할 수 있는 id를 넣어줘야 작동함
    await fetch("/api/users/userInfo", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${usersToken}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((err) => console.error("Error : ", err));

    [
      emailText,
      nameText,
      passwordText,
      phoneText,
      postalCodeText,
      addressText,
      detailAddressText,
      postalCodeLabel,
      addressLabel,
      detailAddressLabel,
    ].forEach((item) => {
      item.classList.remove("hidden");
    });

    [
      email,
      fullName,
      password,
      phone,
      sample6_postcode,
      sample6_postcode_btn,
      sample6_address,
      sample6_detailAddress,
      sample6_extraAddress,
      daumAddressText,
      conformPassword,
      conformPasswordInput,
    ].forEach((item) => {
      item.classList.add("hidden");
    });

    emailText.innerHTML = email.value;
    nameText.innerHTML = fullName.value;
    phoneText.innerHTML = phone.value;
    postalCodeText.innerHTML = sample6_postcode.value;
    addressText.innerHTML = sample6_address.value;
    detailAddressText.innerHTML = sample6_detailAddress.value;
  }
}

async function onClickDeleteBtn(e) {
  e.preventDefault();

  // 끝부분에 식별할 수 있는 아이디를 넣어줘야 작동함
  await fetch("/api/users/withdrawal", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${usersToken}`,
    },
  })
    .then(() => sessionStorage.removeItem("token"))
    .then(() => {
      addModalEvent(() => {
        window.location.href = "/";
      });
      showModal("탈퇴", "탈퇴가 완료되었습니다.");
    })
    .catch((err) => {
      console.error("Error : ", err);
      window.location.href = "/";
      // 메인 페이지로 이동
    });
}

editBtn.addEventListener("click", onClickEditBtn);
deleteBtn.addEventListener("click", onClickDeleteBtn);
