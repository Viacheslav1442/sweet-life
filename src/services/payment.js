import { validateForm } from '../components/JoinForm.js';

export async function initiatePayment(firstName, lastName, phone, amount = 100) {
    if (!validateForm({ firstName, lastName, phone })) {
        throw new Error("Невалідні дані для оплати");
    }

    try {
        const response = await fetch('/api/initiate-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, phone, amount })
        });

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.error || 'Помилка ініціації платежу');
        }

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
    } catch (error) {
        console.error('Помилка:', error);
        alert('Сталася помилка під час обробки.');
        throw error;
    }
}