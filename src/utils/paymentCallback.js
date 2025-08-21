

export function handlePaymentCallback({ paymentFormEl, successMsgEl, modalEl, joinBtnInstance }) {
    window.addEventListener('load', () => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('payment') === 'success') {
            const inviteLink = urlParams.get('invite');
            if (!inviteLink) {
                console.error('Посилання на Telegram не знайдено');
                alert('Помилка: посилання на канал відсутнє');
                return;
            }
            joinBtnInstance.setLink(inviteLink);
            paymentFormEl.style.display = 'none';
            successMsgEl.style.display = 'block';
            modalEl.style.display = 'block';
        }
    });
}