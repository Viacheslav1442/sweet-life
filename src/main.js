import Modal from './components/Modal.js';
import { handlePaymentCallback } from './utils/paymentCallback.js';
import { initJoinForm } from './components/JoinForm.js';
import './components/Slider.js';

document.addEventListener('DOMContentLoaded', () => {
    const modal = new Modal('myModal');
    modal.initCloseOnOutsideClick();
    modal.initCloseButton();

    // Відкриття модалки через конкретні кнопки
    const openModalBtn = document.getElementById('openModal');
    const openModalNowBtn = document.getElementById('openModalNow');

    if (openModalBtn) openModalBtn.addEventListener('click', () => modal.open());
    if (openModalNowBtn) openModalNowBtn.addEventListener('click', () => modal.open());

    // Ініціалізація форми Telegram
    initJoinForm();

    // Callback після оплати
    const form = document.getElementById("registration-form");
    const successMessage = document.getElementById("success-message");
    const telegramLink = document.getElementById("telegram-link");

    if (form && successMessage && telegramLink) {
        handlePaymentCallback({ form, successMessage, modal, telegramLink });
    }
});
