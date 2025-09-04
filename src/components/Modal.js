export default class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        if (!this.modal) {
            console.error(`Модалка з id='${modalId}' не знайдена`);
        }
    }

    open() {
        if (this.modal) {
            this.modal.classList.remove("hidden");
            console.log("Модалка відкрита");
        }
    }

    close() {
        if (this.modal) {
            this.modal.classList.add("hidden");
            console.log("Модалка закрита");
        }
    }

    initCloseOnOutsideClick() {
        if (this.modal) {
            window.removeEventListener("click", this.handleOutsideClick);
            window.addEventListener("click", this.handleOutsideClick.bind(this));
        }
    }

    handleOutsideClick(event) {
        if (event.target === this.modal) {
            this.close();
            console.log("Модалка закрита при кліку поза межами");
        }
    }

    // --- Додаємо нову функцію для хрестика ---
    initCloseButton() {
        if (!this.modal) return;
        const closeBtn = this.modal.querySelector(".close");
        if (closeBtn) {
            closeBtn.addEventListener("click", () => this.close());
        }
    }
}
