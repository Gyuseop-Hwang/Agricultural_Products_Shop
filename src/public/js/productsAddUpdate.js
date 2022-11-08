import * as Api from "./api.js";
import { showModal, addModalEvent } from "./modal.js";

const fileInput = document.getElementById("imageInput");
const titleInput = document.getElementById("title");
const priceInput = document.getElementById("price");
const quantityInput = document.getElementById("quantity");
const categorySelect = document.getElementById("categorySelect");
const deleteButton = document.getElementById("deleteButton");
const addOrUpdateButton = document.getElementById("addOrUpdateButton");
const onSaleCheckBox = document.getElementById("onSaleCheckbox");
const discountInput = document.getElementById("discountInput");

// CK Editor

let editor;

ClassicEditor.create(document.querySelector("#editor"))
  .then((newEditor) => (editor = newEditor))
  .catch((error) => {
    console.error(error);
  });

// 수정 화면일 경우(url에 id 포함되어 있을 경우) 상품 정보 출력
function printProduct(result) {
  const { category, description } = result;
  editor.setData(description);
  deleteButton.classList.remove("hidden");
  for (let i = 0; i < categorySelect.options.length; i++) {
    if (categorySelect.options[i].value === category.name) {
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

  // 할인 금액 받아옴
  let discount = { discountedPrice: false };

  if (onSaleCheckBox.checked === true) {
    discount.discountedPrice = discountInput.value;
  } else if (onSaleCheckBox.checked === false) {
    discount.discountedPrice = false;
  }

  addOrUpdateProduct(
    formData,
    discount,
    window.location.pathname.split("/")[2] ?? null
  );
}

console.log(window.location.pathname.split("/")[2]);

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

// 상품 업데이트 or 추가
async function addOrUpdateProduct(data, discount, id) {
  try {
    // 할인 적용했으나 금액 입력 안 하면 에러
    if (onSaleCheckBox.checked && discount.discountedPrice === "") {
      throw new Error("할인 금액을 입력해주세요.");
    }
    await Api.patch("/api/admin/products", `${id}/toggleSale`, discount);

    //업데이트 요청시
    if (id !== "add") {
      await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: data,
      });

      console.log("put요청");
      alert("수정이 완료됐습니다.");
      window.location.replace("/adminProducts");
      return;
    }

    //등록 요청시
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { Authorization: `Bearer ${sessionStorage["token"]}` },
      body: data,
    });
    console.log("post요청");
    alert("상품이 추가 되었습니다.");
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

// 파일 선택시 img 보여줌
fileInput.addEventListener("change", () => {
  const img = document.getElementById("image");
  img.src = URL.createObjectURL(fileInput.files[0]);
});

addOrUpdateButton.addEventListener("click", submitProduct);

// deleteButton 클릭시 모달 생성
deleteButton.addEventListener("click", (e) => {
  e.preventDefault();
  showModal("상품 삭제", "해당 상품을 삭제하시겠습니까?"); // (title, content)
});
// 모달 "예" 클릭시 실행할 이벤트를 인자로 전달
addModalEvent(deleteProduct);

if (window.location.pathname.split("/")[2] !== "add") {
  const productId = window.location.pathname.split("/")[2];
  addOrUpdateButton.innerText = "수정하기";
  getProduct(productId);
}

onSaleCheckBox.addEventListener("change", () => {
  if (onSaleCheckBox.checked === true) {
    discountInput.disabled = false;
  } else if (onSaleCheckBox.checked === false) {
    discountInput.disabled = true;
    discountInput.value = "";
  }
});
