import { openModal, closeModal, initModalCloseOnOutsideClick } from './components/Modal.js';
import { handlePaymentCallback } from './utils/paymentCallback.js';
import { initiatePayment } from './services/payment.js';

// Ініціалізація закриття модалки при кліку поза межами
initModalCloseOnOutsideClick();

// Обробник для кнопки "Приєднатися зараз"
const openModalBtn = document.getElementById("openModal");
if (openModalBtn) {
    // Видаляємо попередні обробники, щоб уникнути дублювання
    openModalBtn.removeEventListener("click", handleOpenModal);
    openModalBtn.addEventListener("click", handleOpenModal);
    function handleOpenModal() {
        console.log("Кнопка 'Приєднатися зараз' натиснута");
        openModal();
    }
} else {
    console.error("Кнопка з id='openModal' не знайдена");
}

// Обробник для кнопки закриття
const closeBtn = document.querySelector(".close");
if (closeBtn) {
    // Видаляємо попередні обробники
    closeBtn.removeEventListener("click", handleCloseModal);
    closeBtn.addEventListener("click", handleCloseModal);
    function handleCloseModal() {
        console.log("Кнопка закриття натиснута");
        closeModal();
    }
} else {
    console.error("Елемент .close не знайдено");
}

// Обробка форми реєстрації
const form = document.getElementById("registration-form");
if (form) {
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        console.log("Форма відправлена");

        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const phone = document.getElementById("phone").value;

        try {
            await initiatePayment(firstName, lastName, phone);
            console.log("Оплата ініційована");
        } catch (error) {
            console.error("Помилка оплати:", error);
            alert("Сталася помилка під час обробки.");
        }
    });
} else {
    console.error("Форма з id='registration-form' не знайдена");
}

// Обробка callback після оплати
const successMessage = document.getElementById("success-message");
const modal = document.getElementById("myModal");
const telegramLink = document.getElementById("telegram-link");

if (successMessage && modal && telegramLink && form) {
    handlePaymentCallback({ form, successMessage, modal, telegramLink });
} else {
    console.error("Один або більше елементів для callback не знайдені:", {
        form: !!form,
        successMessage: !!successMessage,
        modal: !!modal,
        telegramLink: !!telegramLink
    });
}