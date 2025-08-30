import Modal from './components/Modal.js';
import { handlePaymentCallback } from './utils/paymentCallback.js';
import { initJoinForm } from './components/JoinForm.js';
import { initButtonJoin } from './components/ButtonJoin.js';

console.log('main.js завантажено');

// Дочекатися завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM завантажено, ініціалізація компонентів');

    // Ініціалізація модалки
    const modal = new Modal('myModal');
    console.log('Модалка ініціалізована');
    modal.initCloseOnOutsideClick();

    // Ініціалізація кнопки та форми
    console.log('Запуск initButtonJoin');
    initButtonJoin(modal);
    console.log('Запуск initJoinForm');
    initJoinForm();

    // Обробка callback після оплати
    const form = document.getElementById("registration-form");
    const successMessage = document.getElementById("success-message");
    const telegramLink = document.getElementById("telegram-link");

    if (form && successMessage && modal.modal && telegramLink) {
        console.log('Усі елементи для callback знайдені');
        handlePaymentCallback({ form, successMessage, modal: modal.modal, telegramLink });
    } else {
        console.error("Один або більше елементів для callback не знайдені:", {
            form: !!form,
            successMessage: !!successMessage,
            modal: !!modal.modal,
            telegramLink: !!telegramLink
        });
    }
});