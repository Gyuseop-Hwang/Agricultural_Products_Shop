const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");

const email = document.getElementById("email");
const fullName = document.getElementById("name");
const phone = document.getElementById("phone");
const postalCode = document.getElementById("postalCode");
const address = document.getElementById("address");
const detailAddress = document.getElementById("detailAddress");

const emailText = document.getElementById("emailText");
const nameText = document.getElementById("nameText");
const phoneText = document.getElementById("phoneText");
const postalCodeText = document.getElementById("postalCodeText");
const addressText = document.getElementById("addressText");
const detailAddressText = document.getElementById("detailAddressText");

// 임시 데이터
fetch("http://localhost:4000/users", {
  method: "GET",
  headers: { "Content-Type": "application/json" },
})
  .then((res) => res.json())
  .then((data) => {
    emailText.innerHTML = data[0].email;
    nameText.innerHTML = data[0].fullName;
    phoneText.innerHTML = data[0].phone;
    postalCodeText.innerHTML = data[0].address.postalCode;
    addressText.innerHTML = data[0].address.address1;
    detailAddressText.innerHTML = data[0].address.address2;

    email.value = data[0].email;
    fullName.value = data[0].fullName;
    phone.value = data[0].phone;
    postalCode.value = data[0].address.postalCode;
    address.value = data[0].address.address1;
    detailAddress.value = data[0].address.address2;
  })
  .catch((err) => console.error("Error : ", err));

async function onClickEditBtn(e) {
  e.preventDefault();

  [email, fullName, phone, postalCode, address, detailAddress].forEach(
    (item) => {
      item.classList.remove("hidden");
    }
  );

  if (editBtn.innerText === "수정") {
    editBtn.innerText = "완료";

    [
      emailText,
      nameText,
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
    await fetch("http://localhost:4000/users/0", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((err) => console.error("Error : ", err));
  }
}

async function onClickDeleteBtn(e) {
  e.preventDefault();
  confirm("탈퇴하시겠습니까?");

  // 끝부분에 식별할 수 있는 아이디를 넣어줘야 작동함
  await fetch("http://localhost:4000/api/users/0", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  }).catch((err) => console.error("Error : ", err));

  // 메인 페이지로 이동
  window.location.replace("/");
}

editBtn.addEventListener("click", onClickEditBtn);
deleteBtn.addEventListener("click", onClickDeleteBtn);
