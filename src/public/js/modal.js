const modal = document.getElementById("modal");
const noButton = document.getElementById("noButton");
const yesButton = document.getElementById("yesButton");

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
