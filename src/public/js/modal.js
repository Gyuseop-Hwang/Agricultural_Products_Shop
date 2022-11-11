const modal = document.getElementById("modal");
const noButton = document.getElementById("noButton");
const yesButton = document.getElementById("yesButton");

if (
  location.pathname.split("/")[1] === "product" ||
  location.pathname.split("/")[1] === "login"
) {
  yesButton.style.backgroundColor = "var(--main-color)";
}

function showModal(title, message) {
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalMessage").innerText = message;

  modal.style.display = "flex";
}

function addModalEvent(yesFnc) {
  noButton.addEventListener("click", () => {
    modal.style.display = "none";
  });
  yesButton.addEventListener("click", () => {
    modal.style.display = "none";
    yesFnc();
  });
}

export { showModal, addModalEvent };
