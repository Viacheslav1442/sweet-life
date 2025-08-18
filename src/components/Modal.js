export function openModal() {
    const modal = document.getElementById("myModal");
    if (modal) {
        modal.classList.remove("hidden");
        console.log("Модалка відкрита");
    } else {
        console.error("Модалка з id='myModal' не знайдена");
    }
}

export function closeModal() {
    const modal = document.getElementById("myModal");
    if (modal) {
        modal.classList.add("hidden");
        console.log("Модалка закрита");
    } else {
        console.error("Модалка з id='myModal' не знайдена");
    }
}

export function initModalCloseOnOutsideClick() {
    const modal = document.getElementById("myModal");
    if (modal) {
        // Видаляємо попередні обробники, щоб уникнути дублювання
        window.removeEventListener("click", handleOutsideClick);
        window.addEventListener("click", handleOutsideClick);
        function handleOutsideClick(event) {
            if (event.target === modal) {
                closeModal();
                console.log("Модалка закрита при кліку поза межами");
            }
        }
    } else {
        console.error("Модалка з id='myModal' не знайдена");
    }
}