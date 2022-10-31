const cartProductList = document.getElementById('cartProductList');
const deleteSelectedButton = document.getElementById('deleteSelectedButton');
const deleteAllButton = document.getElementById('deleteAllButton');

let products = [
  {
    id: 1,
    name: '감자',
    price: 3000,
    count: 1,
    deliveryStatus: '배송 완료',
  },
  {
    id: 2,
    name: '토마토',
    price: 6000,
    count: 1,
    deliveryStatus: '배송중',
  },
];

let isCheckedArray = [];

function saveProduct() {
  localStorage.setItem('products', JSON.stringify(products));
}

function paintProduct(product) {
  const tr = document.createElement('tr');

  const checkBoxTd = document.createElement('td');
  const checkBox = document.createElement('input');
  checkBox.setAttribute('type', 'checkbox');
  checkBox.className = 'checkBox';
  checkBox.id = product.id;
  checkBoxTd.appendChild(checkBox);
  checkBox.addEventListener('change', () => {
    if (checkBox.checked) {
      isCheckedArray.push(checkBox);
    }
    isCheckedArray = isCheckedArray.filter(
      (checkBox) => checkBox.checked === true
    );
    console.log(isCheckedArray);
  });

  const nameTd = document.createElement('td');
  nameTd.innerText = product.name;
  const priceTd = document.createElement('td');
  priceTd.innerText = product.price;
  const countTd = document.createElement('td');
  const countInput = document.createElement('input');
  countInput.setAttribute('type', 'number');
  countTd.appendChild(countInput);
  countInput.value = product.count;
  const deliverStatusTd = document.createElement('td');
  deliverStatusTd.innerText = product.deliveryStatus;
  tr.appendChild(checkBoxTd);
  tr.appendChild(nameTd);
  tr.appendChild(priceTd);
  tr.appendChild(countTd);
  tr.appendChild(deliverStatusTd);

  cartProductList.appendChild(tr);
}

function deleteProduct() {
  deleteProduct = isCheckedArray.map((ele) => {
    return ele.id;
  });
  console.log(deleteProduct);
}

deleteSelectedButton.addEventListener('click', deleteProduct);

saveProduct();

const savedProducts = localStorage.getItem('products');

// localStorage에 저장된 상품이 있을 때
if (savedProducts) {
  const parsedProducts = JSON.parse(savedProducts);
  products = parsedProducts;
  products.forEach(paintProduct);
}

// 장바구니 비어있을 때
if (savedProducts.length < 1) {
}
