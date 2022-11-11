const productBtn = document.getElementById("productBtn");
const categoryBtn = document.getElementById("categoryBtn");
const orderBtn = document.getElementById("orderBtn");

const greeting = document.getElementById("greeting");

// 토큰 가져오기
const usersToken = sessionStorage.getItem("token");

// 개인 정보 접근
fetch(`/api/users/userInfo`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${usersToken}`,
  },
})
  .then((res) => res.json())
  .then((data) => {
    if (data.role === "administrator") {
      greeting.innerHTML = `${data.fullName} 관리자님 안녕하세요!`;
    }
  })
  .catch((err) => console.error("Error : ", err));

function onClickProductBtn() {
  location.href = "/admin/products";
}

function onClickCategoryBtn() {
  location.href = "/admin/category";
}

function onClickOrderBtn() {
  location.href = "/admin/orders";
}

productBtn.addEventListener("click", onClickProductBtn);
categoryBtn.addEventListener("click", onClickCategoryBtn);
orderBtn.addEventListener("click", onClickOrderBtn);
