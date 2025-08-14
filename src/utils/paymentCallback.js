import ButtonJoin from '../components/ButtonJoin.js';


// Обробка callback після оплати
window.addEventListener('load', function () {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
        const inviteLink = urlParams.get('invite');
        telegramLink.href = inviteLink;
        telegramLink.textContent = 'Приєднатися до каналу';
        form.style.display = 'none';
        successMessage.style.display = 'block';
        modal.style.display = 'block';
    }
});


export function handlePaymentCallback({ paymentFormEl, successMsgEl, modalEl, joinBtnInstance }) {
    window.addEventListener('load', function () {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('payment') === 'success') {
            const inviteLink = urlParams.get('invite');
            joinBtnInstance.setLink(inviteLink);
            paymentFormEl.style.display = 'none';
            successMsgEl.style.display = 'block';
            modalEl.style.display = 'block';
        }
    });
}


const paymentFormEl = document.getElementById('paymentForm');
const successMsgEl = document.getElementById('successMessage');
const modalEl = document.getElementById('modal');
const telegramBtnEl = document.getElementById('telegramLink');

// Створюємо інстанс кнопки
const joinBtnInstance = new ButtonJoin(telegramBtnEl);

// Підключаємо callback обробку після оплати
handlePaymentCallback({
    paymentFormEl,
    successMsgEl,
    modalEl,
    joinBtnInstance
});