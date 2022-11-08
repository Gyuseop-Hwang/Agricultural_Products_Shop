import * as Api from "/api.js"
const categoryBtnDiv = document.getElementById("categoryBtnDiv");
const categoryInfoDiv = document.getElementById("categoryInfoDiv");
const createCategoryDiv = document.getElementById("createCategoryDiv"); //카테고리 추가 영역
const updateCategoryDiv = document.getElementById("updateCategoryDiv"); //카테고리 수정 및 삭제 영역

/*Input */
const createCategoryInput = document.getElementById("createCategoryInput");
const updateCategoryInput = document.getElementById("updateCategoryInput")
/*Button 카테고리 조작 버튼 */
const createCategoryButton = document.getElementById("createCategoryButton"); //카테고리 추가버튼
const updateCategoryButton = document.getElementById("updateCategoryButton"); //카테고리 수정버튼
const deleteCategoryButton = document.getElementById("deleteCategoryButton"); //카테고리 삭제버트
const cancleCategoryButton = document.getElementById("cancleCategoryButton"); //카테고리 수정영역 닫기

let categorySelected;
/*<---버튼 기능 --->*/
/*카테고리 추가 버튼 클릭*/
createCategoryButton.addEventListener("click", async (ev) => {
	ev.preventDefault()
	const categoryName = createCategoryInput.value.trim();
	try {
		await createCategory(categoryName)
		alert(`${categoryName}이 정상적으로 추가되었습니다.`)
		location.reload();
	} catch (e) {
		alert(e.message)
	}
})
/*카테고리 수정 버튼 클릭 */
updateCategoryButton.addEventListener("click", async (ev) => {
	ev.preventDefault()
	const newCategoryName = updateCategoryInput.value.trim();
	try {
		if (!categorySelected) {
			throw new Error("카테고리가 선택되지 않았습니다.")
		}
		const { _id, name } = categorySelected;
		await updateCategory(_id, newCategoryName)
		alert(`${name}이(가) ${newCategoryName}로 수정되었습니다.`)
		location.reload();
	} catch (e) {
		alert(e.message)
	}
})
/*카테고리 삭제 버튼 클릭 */
deleteCategoryButton.addEventListener("click", async (ev) => {
	ev.preventDefault()
	try {
		if (!categorySelected) {
			throw new Error("카테고리가 선택되지 않았습니다.")
		}
		const { _id, name } = categorySelected;
		await deleteCategory(_id);
		alert(`${name}이(가) 정상적으로 삭제되었습니다.`)
		location.reload();
	} catch (e) {
		alert(e.message)
	}
})

/*카테고리 수정 영역 닫기 */
cancleCategoryButton.addEventListener("click", () => {
	updateCategoryDiv.classList.add("is-hidden")
})

//get 카테고리 목록
async function getCategories() {
	try {
		const result = await Api.get("/api/admin/products/categories");
		return result;
	} catch (e) { console.log(e) }
}
//카테고리 버튼 출력
async function printCategoryBtn() {
	const categories = await getCategories();
	categories.forEach(category => {
		const button = document.createElement("button");
		const span = document.createElement("span");
		button.classList.add("button", "is-rounded", "ml-2")
		/*카테고리 클릭 시 카테고리 수정 필드 보임*/
		button.addEventListener("click", () => {
			updateCategoryDiv.classList.remove("is-hidden"); //수정영역 표시
			updateCategoryInput.value = category.name;
			categorySelected = category;
			console.log(categorySelected);
		})
		span.innerText = category.name;
		button.appendChild(span);
		categoryBtnDiv.appendChild(button);
	});
}

/*<---API--- */
/*post 요청 : 카테고리 추가  */
async function createCategory(categoryName) {
	const result = await Api.post("/api/admin/products/categories", {
		name: categoryName
	})
	return result;
}
/*put 요청 : 카테고리 수정*/
async function updateCategory(categoryId, newCategoryName) {
	const result = await Api.put("/api/admin/products/categories", categoryId, {
		name: newCategoryName
	})
	return result;
}
async function deleteCategory(categoryId) {
	const result = await Api.delete("/api/admin/products/categories", categoryId)
	return result;
}
printCategoryBtn();
