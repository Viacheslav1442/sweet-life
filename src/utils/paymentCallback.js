export function handlePaymentCallback({ form, successMessage, modal, telegramLink }) {
    window.addEventListener('load', async () => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('payment') === 'success' && urlParams.get('order_id')) {
            const orderId = urlParams.get('order_id');
            try {
                const response = await fetch(`/api/get-invite?order_id=${orderId}`);
                const data = await response.json();

                if (data.success && data.inviteLink) {
                    telegramLink.href = data.inviteLink;
                    telegramLink.textContent = 'Приєднатися до каналу';

                    // Сховати форму та показати повідомлення
                    form.classList.add('hidden');
                    successMessage.classList.remove('hidden');

                    // Відкрити модалку
                    modal.open();
                } else {
                    console.error('Лінк не знайдено:', data.error);
                    alert('Помилка: запрошення недоступне');
                }
            } catch (error) {
                console.error('Помилка отримання лінка:', error);
                alert('Помилка під час обробки запрошення');
            }
        }
    });
}
