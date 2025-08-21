import Modal from './components/Modal.js';
import { handleFormSubmit } from './components/JoinForm.js';
import { handlePaymentCallback } from './utils/paymentCallback.js';
import ButtonJoin from './components/ButtonJoin.js';

// Ініціалізація модалки
const modal = new Modal('myModal');
modal.initCloseOnOutsideClick();

// Обробник кнопки "Приєднатися зараз"
const openModalBtn = document.getElementById('openModal');
if (openModalBtn) {
    openModalBtn.addEventListener('click', () => {
        console.log("Кнопка 'Приєднатися зараз' натиснута");
        modal.open();
    });
} else {
    console.error("Кнопка з id='openModal' не знайдена");
}

// Обробник кнопки закриття
const closeBtn = document.querySelector('.close');
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        console.log("Кнопка закриття натиснута");
        modal.close();
    });
} else {
    console.error("Елемент .close не знайдено");
}

// Обробка форми
const form = document.getElementById('registration-form');
if (form) {
    form.addEventListener('submit', handleFormSubmit);
} else {
    console.error("Форма з id='registration-form' не знайдена");
}

// Ініціалізація callback після оплати
const paymentFormEl = document.getElementById('registration-form');
const successMsgEl = document.getElementById('success-message');
const modalEl = document.getElementById('myModal');
const telegramBtnEl = document.getElementById('telegram-link');

if (paymentFormEl && successMsgEl && modalEl && telegramBtnEl) {
    const joinBtnInstance = new ButtonJoin('#telegram-link');
    handlePaymentCallback({ paymentFormEl, successMsgEl, modalEl, joinBtnInstance });
} else {
    console.error('Один або більше елементів для callback не знайдено:', {
        paymentFormEl: !!paymentFormEl,
        successMsgEl: !!successMsgEl,
        modalEl: !!modalEl,
        telegramBtnEl: !!telegramBtnEl
    });
}