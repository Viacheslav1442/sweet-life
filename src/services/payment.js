// payment.js
export async function initiatePayment({ telegram, email, phone, amount = 279 }) {
    try {
        const response = await fetch('/api/pay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ telegram, email, phone, amount }),
        });

        const data = await response.json();

        const container = document.getElementById('payment-container');

        if (data.success && container) {
            container.innerHTML = data.form; // вставляємо форму LiqPay
        } else {
            console.error('Помилка ініціації оплати:', data.error);
            alert('Помилка ініціації оплати');
        }

        return data;
    } catch (error) {
        console.error('Помилка ініціації оплати:', error);
        return { success: false, error };
    }
}
