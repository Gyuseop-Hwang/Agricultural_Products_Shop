//element 가져오기
const categoryDiv = document.getElementById("category");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const categoryDropdown = document.getElementById("categoryDropdown");

const userInfoList = document.getElementById("userInfoList");
const adminInfoList = document.getElementById("adminInfoList");

const usersToken = sessionStorage.getItem("token");
if (usersToken) {
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
        userInfoList.classList.add("is-hidden");
        adminInfoList.classList.remove("is-hidden");
      } else {
        adminInfoList.classList.add("is-hidden");
        userInfoList.classList.remove("is-hidden");
      }
    })
    .catch((err) => { window.location.href = "/errorPage" });
}
//전체 상품 및 카테고리 조회
function getAllProducts() {
  const response = fetch("/api/products");
  return response.then((res) => res.json());
}
//카테고리 ID로 상품 조회
function getProductsByCategory(categoryID) {
  const response = fetch(
    `/api/products/categorization/${categoryID}`
  );
  return response.then((res) => res.json());
}
//상품 이름 키워드로 상품 조회
async function getProductBySearch(keyword) {
  const encoded = encodeURI(encodeURIComponent(keyword));
  const response = fetch(
    `/api/products/search?title=${encoded}`
  );
  return response.then((res) => res.json());
}

//화면에 카테고리 버튼과 전체상품 목록 렌더링
async function renderBtnProducts() {
  const { categories } = await getAllProducts();
  printCategoryBtn(categories);
}

//dom에 카테고리 버튼 생성
function printCategoryBtn(categories) {
  categories.forEach((category) => {
    const aElement = document.createElement("a");
    aElement.classList.add("navbar-item", "pl-6");
    aElement.addEventListener(
      "click",
      () => (location.href = `/search/${category._id}`)
    );
    aElement.innerHTML = `<strong>${category.name}</strong>`;
    categoryDropdown.appendChild(aElement);
  });
}
renderBtnProducts();
