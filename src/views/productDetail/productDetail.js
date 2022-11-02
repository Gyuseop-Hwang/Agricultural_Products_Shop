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
	//수량 변경 시 가격 변경
	countInput.addEventListener("change", ex => {
		totalPriceSpan.innerText = `${(Number(countInput.value) * price).toLocaleString()}원`
	})
	addCartBtn.addEventListener("click", (ev) => {
		ev.preventDefault();
		const count = countInput.value;
		localStorage.setItem("product", JSON.stringify({ ...product, "count": Number(count) }))
		alert("장바구니에 추가되었습니다.");
	})
	totalPriceSpan.innerText = `${price.toLocaleString()}원`

}
printProduct();
