import Modal from '../components/Modal.js';

export function handlePaymentCallback({ form, successMessage, modal, telegramLink }) {
    const modalInstance = new Modal('myModal');
    window.addEventListener('load', async () => {
        console.log('handlePaymentCallback викликано');
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('payment') === 'success' && urlParams.get('order_id')) {
            const orderId = urlParams.get('order_id');
            try {
                const response = await fetch(`/api/get-invite?order_id=${orderId}`);
                const data = await response.json();
                if (data.success && data.inviteLink) {
                    telegramLink.href = data.inviteLink;
                    telegramLink.textContent = 'Приєднатися до каналу';
                    form.classList.add('hidden');
                    successMessage.classList.remove('hidden');
                    modalInstance.open();
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