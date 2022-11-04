import * as Api from "/api.js";

const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");

const email = document.getElementById("email");
const fullName = document.getElementById("name");
const password = document.getElementById("password");
const phone = document.getElementById("phone");
const postalCode = document.getElementById("postalCode");
const address = document.getElementById("address");
const detailAddress = document.getElementById("detailAddress");

const emailText = document.getElementById("emailText");
const nameText = document.getElementById("nameText");
const passwordText = document.getElementById("passwordText");
const phoneText = document.getElementById("phoneText");
const postalCodeText = document.getElementById("postalCodeText");
const addressText = document.getElementById("addressText");
const detailAddressText = document.getElementById("detailAddressText");

// async function getUserInfo() {
//   const usersToken = sessionStorage.getItem("token");
//   try {
//     const data = await Api.get(`/api/users/${userId}`);
//     const { userId, email, fullName, password, phoneNumber, address } = data;
//     emailText.innerHTML = email;
//     nameText.innerHTML = fullName;
//     passwordText.innerHTML = password;
//     phoneText.innerHTML = phoneNumber;
//     postalCodeText.innerHTML = address.postalCode;
//     addressText.innerHTML = address.address1;
//     detailAddressText.innerHTML = address.address2;

//     email.value = email;
//     fullName.value = fullName;
//     password.value = password;
//     phone.value = phoneNumber;
//     postalCode.value = address.postalCode;
//     address.value = address.address1;
//     detailAddress.value = address.address2;
//   } catch (e) {}
// }

// getUserInfo();

// 토큰 값 가져오기

// let base64Payload = usersToken.split(".")[1];
// let payload = Buffer.from(base64Payload, "base64");
// let result = JSON.parse(payload.toString());

//const userid = sessionStorage.getItem("userid");
//const user = Api.get(`/api/users/${userid}`);

// const decodedToken = jwt.verify(usersToken, process.env.JWT_SECRET_KEY);

// 임시 데이터
// async function get(endpoint, params = "") {
//   const apiUrl = `${endpoint}/${params}`;
//   console.log(`%cGET 요청: ${apiUrl} `, "color: #a25cd1;");

//   const res = await fetch(apiUrl, {
//     // JWT 토큰을 헤더에 담아 백엔드 서버에 보냄.
//     headers: {
//       Authorization: `Bearer ${sessionStorage.getItem("token")}`,
//     },
//   })
//     .then((res) => {
//       res.json();
//     })
//     .then((data) => {
//       emailText.innerHTML = data.email;
//       nameText.innerHTML = data.fullName;
//       phoneText.innerHTML = data.phone;
//       postalCodeText.innerHTML = data.address.postalCode;
//       addressText.innerHTML = data.address.address1;
//       detailAddressText.innerHTML = data.address.address2;

//       email.value = data[0].email;
//       fullName.value = data[0].fullName;
//       phone.value = data[0].phone;
//       postalCode.value = data[0].address.postalCode;
//       address.value = data[0].address.address1;
//       detailAddress.value = data[0].address.address2;
//     });

//   // 응답 코드가 4XX 계열일 때 (400, 403 등)
//   if (!res.ok) {
//     const errorContent = await res.json();
//     const { reason } = errorContent;

//     throw new Error(reason);
//   }

//   const result = await res.json();

//   return result;
// }

const usersToken = sessionStorage.getItem("token");

fetch(`http://localhost:5500/api/users/userInfo`, {
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
    postalCodeText.innerHTML = data.address.postalCode;
    addressText.innerHTML = data.address.address1;
    detailAddressText.innerHTML = data.address.address2;

    email.value = data.email;
    fullName.value = data.fullName;
    phone.value = data.phoneNumber;
    postalCode.value = data.address.postalCode;
    address.value = data.address.address1;
    detailAddress.value = data.address.address2;
  })
  .catch((err) => console.error("Error : ", err));

async function onClickEditBtn(e) {
  e.preventDefault();

  [
    email,
    fullName,
    password,
    phone,
    postalCode,
    address,
    detailAddress,
  ].forEach((item) => {
    item.classList.remove("hidden");
  });

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
    ].forEach((item) => {
      item.classList.add("hidden");
    });
  } else if (editBtn.innerText === "완료") {
    editBtn.innerText = "수정";
    // 완료 되었을 때의 기능을 추가 - 데이터 보내주기
    let data = {
      email: email.value,
      fullName: fullName.value,
      phone: phone.value,
      address: {
        // 스키마 참고해서 그대로..!
        postalCode: postalCode.value,
        address1: address.value,
        address2: detailAddress.value,
      },
    };

    // 끝부분에 식별할 수 있는 id를 넣어줘야 작동함
    await fetch("http://localhost:5500/users", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${usersToken}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((err) => console.error(err));
  }
}

async function onClickDeleteBtn(e) {
  e.preventDefault();
  //confirm("탈퇴하시겠습니까?");

  // 끝부분에 식별할 수 있는 아이디를 넣어줘야 작동함
  await fetch("http://localhost:5500/api/users/withdrawal", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${usersToken}`,
    },
  }).catch((err) => console.error(err));

  // 메인 페이지로 이동
  window.location.href = "/";
}

editBtn.addEventListener("click", onClickEditBtn);
deleteBtn.addEventListener("click", onClickDeleteBtn);
