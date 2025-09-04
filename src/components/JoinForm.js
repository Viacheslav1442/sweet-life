import { initiatePayment } from '../services/payment.js';

export function initJoinForm() {
    const form = document.getElementById("registration-form");
    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            console.log("Форма відправлена");

            const telegram = document.getElementById("telegram").value;
            const email = document.getElementById("email").value;
            const phone = document.getElementById("phone").value;

            try {
                const data = await initiatePayment(telegram, email, phone, 500);
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
                } else {
                    throw new Error('Помилка ініціації оплати');
                }
            } catch (error) {
                console.error("Помилка оплати:", error);
                alert("Сталася помилка під час обробки.");
            }
        });
    } else {
        console.error("Форма з id='registration-form' не знайдена");
    }
}