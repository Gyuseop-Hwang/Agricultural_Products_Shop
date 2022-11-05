
const productImage = document.getElementById("image")
const titleSpan = document.getElementById("title")
const priceSpan = document.getElementById("price")
const quantitySpan = document.getElementById("quantity");
const categoryNameSpan = document.getElementById("categoryName")
const descriptionSpan = document.getElementById("discription")
const addCartBtn = document.getElementById("addCartBtn");
const countInput = document.getElementById("count");
const totalPriceSpan = document.getElementById("totalPrice");
//json server에서 목데이터로 item object 가져오기
function getProduct(productId) {
	return fetch(`http://localhost:5500/api/products/${productId}`).then(res => res.json());
}

//상세페이지에 상품 출력
async function printProduct(productId) {
	const product = await getProduct(productId);
	const { _id, title, imageUrl, price, quantity, description, category } = product;
	productImage.src = imageUrl
	titleSpan.innerText = title
	priceSpan.innerText = `${price.toLocaleString()}원`
	quantitySpan.innerText = `남은 수량: ${quantity}`
	categoryNameSpan.innerText = category.name;
	descriptionSpan.innerText = description;
	//수량 변경 시 가격 변경
	countInput.addEventListener("change", ex => {
		totalPriceSpan.innerText = `${(Number(countInput.value) * price).toLocaleString()}원`
	})
	addCartBtn.addEventListener("click", (ev) => {
		ev.preventDefault();
		const count = countInput.value;
		localStorage.setItem("product", JSON.stringify({ _id, "count": Number(count) }))
		alert("장바구니에 추가되었습니다.");
	})
	totalPriceSpan.innerText = `${price.toLocaleString()}원`

}
let productId = '6363578739bd781e3f24e278'
printProduct(productId);
