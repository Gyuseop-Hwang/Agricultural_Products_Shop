import * as Api from "/api.js";

const fileInput = document.getElementById("imageInput");
const titleInput = document.getElementById("title");
const priceInput = document.getElementById("price");
const quantityInput = document.getElementById("quantity");
const categorySelect = document.getElementById("categorySelect");
const deleteButton = document.getElementById("deleteButton");
const addOrUpdateButton = document.getElementById("addOrUpdateButton");

// CK Editor

let editor;

ClassicEditor.create(document.querySelector("#editor"))
  .then((newEditor) => (editor = newEditor))
  .catch((error) => {
    console.error(error);
  });

// 카테고리 출력
function printCategory(category) {
  const option = document.createElement("option");
  option.innerText = category.name;
  option.value = category._id;
  categorySelect.appendChild(option);
}

// 수정 화면일 경우(url에 id 포함되어 있을 경우) 상품 정보 출력
function printProduct(result) {
  const { title, price, quantity, category, description } = result;
  titleInput.value = title;
  priceInput.value = price;
  quantityInput.value = quantity;
  editor.setData(description);
  deleteButton.classList.remove("hidden");
  for (let i = 0; i < categorySelect.options.length; i++) {
    if (categorySelect.options[i].value === category._id) {
      categorySelect.options[i].selected = true;
    }
  }
}

// submit시 입력된 값 받아옴
function submitProduct(e) {
  e.preventDefault();
  const formData = new FormData();
  formData.append("title", titleInput.value);
  formData.append("image", fileInput.files[0]);
  formData.append("price", priceInput.value);
  formData.append("quantity", quantityInput.value);
  formData.append("description", editor.getData());
  formData.append(
    "category",
    categorySelect.options[categorySelect.selectedIndex].value
  );

  addOrUpdateProduct(formData, window.location.pathname.split("/")[2] ?? null);
}

// 수정 화면일 경우(url에 id 포함되어 있을 경우) 상품 get요청
async function getProduct(productId) {
  try {
    const result = await Api.get("/api/products", productId);
    printProduct(result);
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

// category get 요청
async function getAllCategories() {
  try {
    const result = await Api.get("/api/admin/products/categories");
    result.forEach(printCategory);
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

async function addOrUpdateProduct(data, id) {
  try {
    //업데이트 요청시
    if (id !== "add") {
      const bodyData = JSON.stringify(data);
      const result = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: bodyData,
      });
      alert("수정이 완료됐습니다.");
      window.location.replace("/adminProducts");
      return result;
    }

    //등록 요청시
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { Authorization: `Bearer ${sessionStorage["token"]}` },
      body: data,
    });
    window.location.replace("/adminProducts");
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

// 상품 삭제
async function deleteProduct() {
  try {
    const id = window.location.pathname.split("/")[2];
    if (id !== "add") {
      await Api.delete("/api/admin/products", id);
      window.location.replace("/adminProducts");
    }
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

// 이미지 등록
// fileInput.addEventListener("change", () => {
//   console.log(fileInput.files);
// });
getAllCategories();
addOrUpdateButton.addEventListener("click", submitProduct);
deleteButton.addEventListener("click", deleteProduct);

if (window.location.pathname.split("/")[2] !== "add") {
  const productId = window.location.pathname.split("/")[2];
  addOrUpdateButton.innerText = "수정하기";
  getProduct(productId);
}
