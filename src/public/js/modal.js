const modalTrigger = document.querySelector(".modal-trigger");
const modal = document.getElementById("modal");
const noButton = document.getElementById("noButton");
const yesButton = document.getElementById("yesButton");

function showModal(title, message) {
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  modalTitle.innerText = title;
  modalMessage.innerText = message;

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
