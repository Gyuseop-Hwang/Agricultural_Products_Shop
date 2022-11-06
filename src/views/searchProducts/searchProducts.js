//element 가져오기
const categoryDiv = document.getElementById("category")
const productsList = document.getElementById("productsList")
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", printProductsBySearch)

//전체 상품 및 카테고리 조회
function getAllProducts() {
	const response = fetch("http://localhost:5500/api/products");
	return response.then(res => res.json());
}
//카테고리 ID로 상품 조회
function getProductsByCategory(categoryID) {
	const response = fetch(`http://localhost:5500/api/products/categorization/${categoryID}`);
	return response.then(res => res.json());
}
//상품 이름 키워드로 삼풍 조회
async function getProductBySearch(keyword) {
	const encoded = encodeURI(encodeURIComponent(keyword));
	const response = fetch(`http://localhost:5500/api/products/search?title=${encoded}`);
	return response.then(res => res.json())
}

//화면에 카테고리 버튼과 전체상품 목록 렌더링
async function renderBtnProducts() {
	const { categories, products } = await getAllProducts();
	printCategoryBtn(categories);
	printProducts(products);
}

//dom에 카테고리 버튼 생성
function printCategoryBtn(categories) {
	categories.forEach(category => {
		const button = document.createElement("button");
		const span = document.createElement("span");
		button.classList.add("button", "is-rounded", "ml-2")
		button.categoryId = category._id;
		span.innerText = category.name;
		button.appendChild(span);
		button.addEventListener('click', printProductsByCategory);
		categoryDiv.appendChild(button);
	});
}

//이벤트핸들러 :카테고리 버튼 클릭 시 카테고리 별 상품 목록 출력
async function printProductsByCategory() {
	const products = await getProductsByCategory(this.categoryId);
	eraseProducts()
	printProducts(products);
}
// 상품 키워드 검색 시 해당하는 상품 목록 출력
async function printProductsBySearch() {
	const products = await getProductBySearch(searchInput.value.trim());
	eraseProducts()
	printProducts(products);
}
//상품 목록 초기화
function eraseProducts() {
	productsList.innerHTML = "";

}
//상품 목록 출력하기
function printProducts(products) {
	products.forEach(product => {
		console.log(product.image.path)
		const div = document.createElement("div");
		div.classList.add("list-item", "product-container");
		div.innerHTML = `
		<div>
			<figure class="image is-128x128">
				<img class="" src="${product.image.path}" alt="${product.title} 이미지">
				</figure>
		</div>

		<div class="product-contents">
			<div class="product-title">
				<a href="/product/${product._id}">${product.title}</a>
			</div>
			<div class="product-price">
				<span>${product.price.toLocaleString('ko-KR')}원</span>
			</div>
		</div>
	`
		productsList.appendChild(div);
	})
}

renderBtnProducts()
