export async function initiatePayment({ telegram, email, phone, amount = 279 }) {
    try {
        // Формуємо URL з параметрами для сервера
        const params = new URLSearchParams({ amount, description: "Оплата доступу" });
        const response = await fetch(`/api/pay?${params.toString()}`);
        const html = await response.text();

        // Вставляємо форму в DOM (можна у спеціальний контейнер)
        const container = document.getElementById('payment-container');
        if (container) {
            container.innerHTML = html;
        } else {
            console.warn('Не знайдено контейнер для форми оплати');
        }

        return { success: true };
    } catch (error) {
        console.error('Помилка ініціації оплати:', error);
        return { success: false, error };
    }
}
