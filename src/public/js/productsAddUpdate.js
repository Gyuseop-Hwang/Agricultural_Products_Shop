import * as Api from "./api.js";
import { showModal, addModalEvent } from "./modal.js";

const fileInput = document.getElementById("imageInput");
const thumbnailImage = document.getElementById("thumbnailImage");
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

ClassicEditor.create(document.querySelector("#editor"), {
  toolbar: {
    items: ["heading", "|", "bold", "italic", "|", "undo", "redo"],
  },
  innerHeight: 350,
})
  .then((newEditor) => {
    editor = newEditor;
  })
  .catch((error) => {
    console.error(error);
  });

// submit시 입력된 값 받아옴
function submitProduct(e) {
  e.preventDefault();
  // 할인 금액 받아옴
  let discount = {};

  if (onSaleCheckBox.checked === true) {
    discount.discountedPrice = discountInput.value;
  } else if (onSaleCheckBox.checked === false) {
    discount.discountedPrice = "cancel";
  }
  // 상품 정보(할인 금액 제외한) 받아옴
  const formData = new FormData();
  formData.append("title", titleInput.value);
  formData.append("image", fileInput.files[0]);
  formData.append("price", Number(priceInput.value));
  formData.append("quantity", Number(quantityInput.value));
  formData.append("description", editor.getData());
  formData.append(
    "category",
    categorySelect.options[categorySelect.selectedIndex].value
  );

  addOrUpdateProduct(
    formData,
    discount,
    window.location.pathname.split("/")[3] ?? null
  );
}

// 수정 화면일 경우(url에 id 포함되어 있을 경우) 삭제버튼, 상품 정보(category, description, onSale) 출력
function printProduct(result) {
  const { category, description, sale } = result;

  editor.setData(description);

  for (let i = 0; i < categorySelect.options.length; i++) {
    if (categorySelect.options[i].value === category._id) {
      categorySelect.options[i].selected = true;
    }
  }

  deleteButton.classList.remove("hidden");

  if (sale.onSale === true) {
    onSaleCheckBox.checked = true;
    discountInput.disabled = false;
    discountInput.value = sale.discountedPrice;
    return;
  }
  onSaleCheckBox.checked = false;
}

// 수정 화면일 경우(url에 id 포함되어 있을 경우) 상품 get요청
async function getProduct(productId) {
  try {
    const result = await Api.get("/api/products", productId);
    printProduct(result);
  } catch (err) {
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}

// 상품 업데이트 or 추가
async function addOrUpdateProduct(data, discount, id) {
  try {
    // 빈 데이터 값이 있으면 에러
    for (let key of data.keys()) {
      if (data.get(key) === "") {
        throw new Error("모든 정보를 입력해주세요.");
      }
    }
    if (onSaleCheckBox.checked && discount.discountedPrice === "0") {
      throw new Error("할인 금액을 입력해주세요.");
    }
    if (Number(discount.discountedPrice) < 100) {
      throw new Error("할인 가격은 2자리 이상이어야 합니다.");
    }
    if (Number(discount.discountedPrice) >= data.get("price")) {
      throw new Error("할인 가격은 현재 상품의 가격보다 낮아야 합니다.");
    }

    //업데이트 요청시 put 요청
    if (id !== "add") {
      await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: data,
      });
      // 할인 정보 patch
      await Api.patch("/api/admin/products", `${id}/toggleSale`, discount);

      alert("수정이 완료됐습니다.");
      window.location.replace("/admin/products");
      return;
    }

    //등록 요청시 post 요청
    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { Authorization: `Bearer ${sessionStorage["token"]}` },
      body: data,
    });
    const result = await response.json();
    // 할인 정보 patch
    await Api.patch(
      "/api/admin/products",
      `${result._id}/toggleSale`,
      discount
    );

    alert("상품이 추가 되었습니다.");
    window.location.replace("/admin/products");
  } catch (err) {
    alert(err.message);
  }
}

// 상품 삭제
async function deleteProduct() {
  try {
    const id = window.location.pathname.split("/")[3];
    if (id !== "add") {
      await Api.delete("/api/admin/products", id);
      window.location.replace("/admin/products");
    }
  } catch (err) {
    alert(err.message);
  }
}

// 파일 선택시 img 보여줌
fileInput.addEventListener("change", () => {
  thumbnailImage.src = URL.createObjectURL(fileInput.files[0]);
});

addOrUpdateButton.addEventListener("click", submitProduct);

// deleteButton 클릭시 모달 생성
deleteButton.addEventListener("click", (e) => {
  e.preventDefault();
  showModal("상품 삭제", "해당 상품을 삭제하시겠습니까?"); // (title, content)
});
// 모달 "예" 클릭시 실행할 이벤트를 인자로 전달
addModalEvent(deleteProduct);

// 체크박스 toggle => check true면 input 입력 가능
onSaleCheckBox.addEventListener("change", () => {
  if (onSaleCheckBox.checked === true) {
    discountInput.disabled = false;
  } else if (onSaleCheckBox.checked === false) {
    discountInput.disabled = true;
    discountInput.value = "";
  }
});

// 수정페이지면 상품 정보 받아옴
if (window.location.pathname.split("/")[3] !== "add") {
  const productId = window.location.pathname.split("/")[3];
  addOrUpdateButton.innerText = "수정하기";
  getProduct(productId);
}

// form submit 막기
document.addEventListener("keydown", function (e) {
  if (e.code === "Enter") {
    e.preventDefault();
  }
});
