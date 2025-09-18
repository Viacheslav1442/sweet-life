import { initiatePayment } from '../services/payment.js';

export function initJoinForm() {
    const form = document.getElementById("registration-form");
    if (!form) return console.error("Форма з id='registration-form' не знайдена");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        console.log("Форма відправлена");

        const telegram = document.getElementById("telegram").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;

        try {
            // Викликаємо initiatePayment з об'єктом
            const data = await initiatePayment({ telegram, email, phone, amount: 279 });

            if (data.success) {
                // Створюємо форму LiqPay
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

                // Вставляємо форму у контейнер модалки
                const container = document.getElementById('payment-container');
                if (container) {
                    container.innerHTML = ''; // очищаємо контейнер перед вставкою
                    container.appendChild(liqpayForm);
                    liqpayForm.submit(); // відправляємо форму
                } else {
                    console.warn('Контейнер для форми LiqPay не знайдено');
                }
            } else {
                throw new Error('Помилка ініціації оплати');
            }
        } catch (error) {
            console.error("Помилка оплати:", error);
            alert("Сталася помилка під час обробки.");
        }
    });
}
