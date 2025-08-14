export async function initiatePayment(firstName, lastName, phone) {
    try {
        const response = await fetch('/api/initiate-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, phone, amount: 100 })
        });

        const data = await response.json();

        if (data.success) {
            const liqpayForm = document.createElement('form');
            liqpayForm.method = 'POST';
            liqpayForm.action = 'https://www.liqpay.ua/api/3/checkout';
            liqpayForm.acceptCharset = 'utf-8';

            const inputData = document.createElement('input');
            inputData.type = 'hidden';
            inputData.name = 'data';
            inputData.value = data.liqpayData;
            liqpayForm.appendChild(inputData);

            const inputSignature = document.createElement('input');
            inputSignature.type = 'hidden';
            inputSignature.name = 'signature';
            inputSignature.value = data.liqpaySignature;
            liqpayForm.appendChild(inputSignature);

            document.body.appendChild(liqpayForm);
            liqpayForm.submit();
        }
    } catch (error) {
        console.error('Помилка:', error);
        alert('Сталася помилка під час обробки.');
    }
}


const modalEl = document.getElementById('myModal');
const successMsgEl = document.getElementById('success-message');
const telegramLinkEl = document.getElementById('telegram-link');
const closeBtn = modalEl.querySelector('.close');

closeBtn.addEventListener('click', () => {
    modalEl.style.display = 'none';
});

// При успішній оплаті:
function showSuccess(inviteLink) {
    telegramLinkEl.href = inviteLink;
    telegramLinkEl.textContent = 'Приєднатися до каналу';
    successMsgEl.style.display = 'block';
    modalEl.style.display = 'block';
}
