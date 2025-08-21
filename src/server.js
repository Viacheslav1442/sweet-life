const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

app.post('/api/initiate-payment', (req, res) => {
    const { firstName, lastName, phone, amount } = req.body;
    const publicKey = 'your_liqpay_public_key';
    const privateKey = 'your_liqpay_private_key';

    const data = {
        public_key: publicKey,
        version: 3,
        action: 'pay',
        amount,
        currency: 'UAH',
        description: `Оплата від ${firstName} ${lastName}`,
        order_id: `order_${Date.now()}`,
        language: 'uk',
        result_url: 'http://your-site.com?payment=success&invite=https://t.me/your_channel' // Замініть на ваш URL та Telegram-посилання
    };

    const dataBase64 = Buffer.from(JSON.stringify(data)).toString('base64');
    const signature = crypto.createHash('sha1')
        .update(privateKey + dataBase64 + privateKey)
        .digest('base64');

    res.json({ success: true, liqpayData: dataBase64, liqpaySignature: signature });
});

app.listen(3000, () => console.log('Server running on port 3000'));