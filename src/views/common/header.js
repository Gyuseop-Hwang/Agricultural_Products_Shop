//element 가져오기
const categoryDiv = document.getElementById("category")
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const categoryDropdown = document.getElementById("categoryDropdown")
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
//상품 이름 키워드로 상품 조회
async function getProductBySearch(keyword) {
	const encoded = encodeURI(encodeURIComponent(keyword));
	const response = fetch(`http://localhost:5500/api/products/search?title=${encoded}`);
	return response.then(res => res.json())
}

//화면에 카테고리 버튼과 전체상품 목록 렌더링
async function renderBtnProducts() {
	const { categories, products } = await getAllProducts();
	printCategoryBtn(categories);
}

//dom에 카테고리 버튼 생성
function printCategoryBtn(categories) {
	categories.forEach(category => {
		const aElement = document.createElement("a");
		const span = document.createElement("span");
		aElement.classList.add("navbar-item")
		aElement.addEventListener("click", () => location.href = '/search');
		aElement.categoryId = category._id;
		aElement.innerText = category.name;
		categoryDropdown.appendChild(aElement);
	});
}
renderBtnProducts()
