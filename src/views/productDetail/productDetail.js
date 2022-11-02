const productImage = document.getElementById("image")
const titleSpan = document.getElementById("title")
const priceSpan = document.getElementById("price")
const quantitySpan = document.getElementById("quantity");
const categoryNameSpan = document.getElementById("categoryName")
const descriptionSpan = document.getElementById("discription")
const addCartBtn = document.getElementById("addCartBtn");
const countInput = document.getElementById("count");
//json server에서 item object 가져오기
function getProduct() {
	return fetch("http://localhost:4000/item").then(res => res.json());
}

//상세페이지에 상품 출력
async function printProduct() {
	const product = await getProduct();
	const { _id, title, imageUrl, price, quantity, description, category } = product;
	console.log(imageUrl);
	productImage.src = imageUrl
	titleSpan.innerText = title
	priceSpan.innerText = `${price.toLocaleString()}원`
	quantitySpan.innerText = `남은 수량: ${quantity}`
	categoryNameSpan.innerText = category.name;
	descriptionSpan.innerText = description;
	addCartBtn.addEventListener("click", (ev) => {
		ev.preventDefault();
		const count = countInput.value;
		localStorage.setItem("product", JSON.stringify({ ...product, "count": count }))
	})
}
printProduct();
