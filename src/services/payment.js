

export async function initiatePayment(telegram, email, phone, amount = 279) {
    try {
        const response = await fetch('/api/initiate-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ telegram, email, phone, amount })
        });
        return await response.json();
    } catch (error) {
        console.error('Помилка ініціації оплати:', error);
        throw error;
    }
}