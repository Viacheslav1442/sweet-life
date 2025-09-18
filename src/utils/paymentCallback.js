// paymentCallback.js
export function handlePaymentCallback({ form, successMessage, modal, telegramLink }) {
    window.addEventListener('load', async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const paymentStatus = urlParams.get('payment');
        const orderId = urlParams.get('order_id');

        if (paymentStatus === 'success' && orderId) {
            try {
                const response = await fetch(`/api/get-invite?orderId=${orderId}`);
                const data = await response.json();

                if (data.success && data.inviteLink) {
                    if (telegramLink) {
                        telegramLink.href = data.inviteLink;
                        telegramLink.textContent = 'Приєднатися до каналу';
                    }

                    if (form) form.classList.add('hidden');
                    if (successMessage) successMessage.classList.remove('hidden');

                    if (modal && typeof modal.open === 'function') modal.open();
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
