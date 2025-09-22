// JoinForm.js
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
            // Викликаємо initiatePayment, який повертає готову форму
            const data = await initiatePayment({ telegram, email, phone, amount: 279 });

            if (data.success) {
                // Форма вже вставлена в контейнер у initiatePayment
                // Автоматично сабмітимо її
                const liqpayForm = document.querySelector('#payment-container form');
                if (liqpayForm) {
                    liqpayForm.submit();
                } else {
                    console.warn('Форма LiqPay не знайдена для сабміту');
                }
            } else {
                throw new Error(data.error || 'Помилка ініціації оплати');
            }
        } catch (error) {
            console.error("Помилка оплати:", error);
            alert("Сталася помилка під час обробки.");
        }
    });
}
