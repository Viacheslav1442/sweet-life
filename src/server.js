import express from 'express';
import LiqPay from 'liqpay-sdk-nodejs';
import axios from 'axios';
import { promises as fs } from 'fs';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Твої ключі (з .env у продакшені)
const PUBLIC_KEY = 'your_liqpay_public_key'; // З кабінету LiqPay
const PRIVATE_KEY = 'your_liqpay_private_key';
const BOT_TOKEN = 'your_telegram_bot_token'; // З @BotFather
const CHANNEL_ID = -1001234567890; // ID твого каналу (з getUpdates)
const DB_FILE = './db.json'; // JSON для збереження даних

const liqpay = new LiqPay(PUBLIC_KEY, PRIVATE_KEY);

// Ініціалізація JSON "БД"
async function initDB() {
    try {
        await fs.access(DB_FILE);
    } catch {
        await fs.writeFile(DB_FILE, JSON.stringify({ payments: [] }));
    }
}

// Збереження даних у JSON
async function saveToDB(data) {
    const db = JSON.parse(await fs.readFile(DB_FILE));
    const existing = db.payments.find(p => p.orderId === data.orderId);
    if (existing) {
        Object.assign(existing, data);
    } else {
        db.payments.push(data);
    }
    await fs.writeFile(DB_FILE, JSON.stringify(db));
}

// Отримання лінка з JSON за orderId
async function getInviteFromDB(orderId) {
    const db = JSON.parse(await fs.readFile(DB_FILE));
    const payment = db.payments.find(p => p.orderId === orderId);
    return payment ? payment.inviteLink : null;
}

// Ендпоінт для ініціації оплати
app.post('/api/initiate-payment', async (req, res) => {
    await initDB();
    const { firstName, lastName, phone, amount = 500 } = req.body; // Сума 500 грн
    const orderId = `order_${Date.now()}`;

    const params = {
        action: 'pay',
        amount: amount.toString(),
        currency: 'UAH',
        description: `Оплата курсу випічки для ${firstName} ${lastName}`,
        order_id: orderId,
        version: '3',
        public_key: PUBLIC_KEY,
        result_url: 'http://localhost:5173?payment=success&order_id=' + orderId, // Redirect на фронтенд
        server_url: 'http://your-ngrok-url/api/liqpay-callback', // Вебхук (ngrok для тестів)
        phone: phone,
        language: 'uk'
    };

    const data = liqpay.cnb_data(params);
    const signature = liqpay.cnb_signature(params);

    await saveToDB({ firstName, lastName, phone, orderId });

    res.json({ success: true, liqpayData: data, liqpaySignature: signature, orderId });
});

// Вебхук для перевірки оплати
app.post('/api/liqpay-callback', async (req, res) => {
    const { data, signature } = req.body;

    if (liqpay.check_signature(data, signature, PRIVATE_KEY)) {
        const paymentData = JSON.parse(Buffer.from(data, 'base64').toString());
        if (paymentData.status === 'success' || paymentData.status === 'sandbox') {
            const orderId = paymentData.order_id;

            try {
                const inviteLink = await generateTelegramInvite(orderId);
                await saveToDB({ orderId, inviteLink });
                console.log(`Успішна оплата для ${orderId}. Лінк: ${inviteLink}`);
            } catch (err) {
                console.error('Помилка генерації лінку:', err);
            }

            res.sendStatus(200);
        } else {
            console.log('Оплата не успішна:', paymentData.status);
            res.sendStatus(200);
        }
    } else {
        console.error('Невірний signature');
        res.sendStatus(400);
    }
});

// Генерація Telegram-лінка
async function generateTelegramInvite(orderId) {
    try {
        const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/createChatInviteLink`, {
            chat_id: CHANNEL_ID,
            name: `Запрошення для курсу ${orderId}`,
            member_limit: 1,
            expire_date: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30),
            creates_join_request: false
        });

        if (response.data.ok) {
            return response.data.result.invite_link;
        } else {
            throw new Error('Помилка Telegram API: ' + JSON.stringify(response.data));
        }
    } catch (error) {
        console.error('Помилка генерації лінку:', error.response?.data || error.message);
        throw error;
    }
}

// Ендпоінт для отримання лінка
app.get('/api/get-invite', async (req, res) => {
    const { order_id } = req.query;
    const inviteLink = await getInviteFromDB(order_id);
    if (inviteLink) {
        res.json({ success: true, inviteLink });
    } else {
        res.status(404).json({ success: false, error: 'Лінк не знайдено' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущено на порту ${PORT}`));