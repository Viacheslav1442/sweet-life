export function openModal() {
    const modal = document.getElementById("modal");
    modal.classList.remove("hidden");
}

export function closeModal() {
    const modal = document.getElementById("modal");
    modal.classList.add("hidden");
}

// Додатково: закриття при кліку поза модалкою
export function initModalCloseOnOutsideClick() {
    const modal = document.getElementById("modal");

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
}
