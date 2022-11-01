//element 가져오기
const categoryDiv = document.getElementById("category")
const productsList = document.getElementById("productsList")


//전체 상품 가져오기
function getAllProducts() {
	const response = fetch("http://localhost:4000/products");
	return response.then(res => res.json());
}
//전체 카테고리 가져오기
function getAllCategories() {
	const response = fetch("http://localhost:4000/categories");
	return response.then(res => res.json());
}
//dom에 카테고리 버튼 생성
async function printCategories() {
	const categories = await getAllCategories();
	console.log(categories)
	categories.forEach(category => {
		const a = document.createElement("a");
		const span = document.createElement("span");
		a.href = `/products/categorization/${category.name}`;
		a.classList.add("button", "is-rounded", "ml-2")
		span.innerText = category.name;
		a.appendChild(span);
		categoryDiv.appendChild(a);
	});
}

//상품 목록 출력하기
async function printProducts() {
	const products = await getAllProducts();
	products.forEach(product => {
		const div = document.createElement("div");
		div.classList.add("list-item", "product-container");
		div.innerHTML = `
		<div>
			<figure class="image is-128x128">
				<img class="" src="${product.imageUrl}" alt="${product.title} 이미지">
				</figure>
		</div>

		<div class="product-contents">
			<div class="product-title">
				<a href="/products/:${product.id}">${product.title}</a>
			</div>
			<div class="product-price">
				<span>${product.price.toLocaleString('ko-KR')}원</span>
			</div>
		</div>
	`
		productsList.appendChild(div);
	})
}

printCategories()
printProducts()
