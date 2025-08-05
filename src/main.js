import { openModal, closeModal, initModalCloseOnOutsideClick } from "./components/Modal.js";

document.getElementById("joinBtn").addEventListener("click", openModal);
document.getElementById("closeModal").addEventListener("click", closeModal);

initModalCloseOnOutsideClick();