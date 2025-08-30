import Modal from './Modal.js';

export function initButtonJoin(modal) {
    console.log('Ініціалізація ButtonJoin');
    const openModalBtn = document.getElementById("openModal");
    if (openModalBtn) {
        console.log('Кнопка #openModal знайдена');
        openModalBtn.removeEventListener("click", handleOpenModal);
        openModalBtn.addEventListener("click", handleOpenModal);
        function handleOpenModal() {
            console.log("Кнопка 'Приєднатися зараз' натиснута");
            modal.open();
        }
    } else {
        console.error("Кнопка з id='openModal' не знайдена");
    }
}