import express from 'express';
import LiqPay from 'liqpay-sdk-nodejs';
import { promises as fs } from 'fs';
import path from 'path';
import url from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PUBLIC_KEY = process.env.LIQPAY_PUBLIC || 'your_liqpay_public_key';
const PRIVATE_KEY = process.env.LIQPAY_PRIVATE || 'your_liqpay_private_key';
const DB_FILE = path.join(__dirname, 'db.json');
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'change_me_to_secure_token';

const liqpay = new LiqPay(PUBLIC_KEY, PRIVATE_KEY);

// init db
async function initDB() {
  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify({ payments: [] }, null, 2));
  }
}

async function readDB() {
  await initDB();
  const raw = await fs.readFile(DB_FILE, 'utf8');
  return JSON.parse(raw);
}

async function saveDB(db) {
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2));
}

// Save or update payment record
async function saveToDB(data) {
  const db = await readDB();
  const existing = db.payments.find(p => p.orderId === data.orderId);
  if (existing) {
    Object.assign(existing, data);
  } else {
    db.payments.push(data);
  }
  await saveDB(db);
}

/* --------- Public endpoints (initiate payment + webhook + save user data) ---------- */

// initiate-payment (пример из твоего кода)
app.post('/api/initiate-payment', async (req, res) => {
  await initDB();
  const { firstName, lastName, phone, amount = 279 } = req.body;
  const orderId = `order_${Date.now()}`;
  const params = {
    action: 'pay',
    amount: amount.toString(),
    currency: 'UAH',
    description: `Оплата курса для ${firstName} ${lastName}`,
    order_id: orderId,
    version: '3',
    public_key: PUBLIC_KEY,
    result_url: `http://localhost:5173?payment=success&order_id=${orderId}`,
    server_url: 'http://your-ngrok-url/api/liqpay-callback',
    phone: phone,
    language: 'uk',
  };
  const data = liqpay.cnb_data(params);
  const signature = liqpay.cnb_signature(params);
  await saveToDB({
    firstName,
    lastName,
    phone,
    orderId,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
  res.json({
    success: true,
    liqpayData: data,
    liqpaySignature: signature,
    orderId,
  });
});

// webhook
app.post('/api/liqpay-callback', async (req, res) => {
  const { data, signature } = req.body;
  if (liqpay.check_signature(data, signature, PRIVATE_KEY)) {
    const paymentData = JSON.parse(Buffer.from(data, 'base64').toString());
    if (paymentData.status === 'success' || paymentData.status === 'sandbox') {
      const orderId = paymentData.order_id;
      await saveToDB({
        orderId,
        status: 'paid',
        paidAt: new Date().toISOString(),
      });
      console.log(`✅ Успішна оплата для ${orderId}`);
    } else {
      console.log('❌ Оплата не успішна:', paymentData.status);
    }
    res.sendStatus(200);
  } else {
    console.error('Невірний signature');
    res.sendStatus(400);
  }
});

// save-userdata — пользователь вводит telegram после оплаты
app.post('/api/save-userdata', async (req, res) => {
  const { orderId, telegramUsername } = req.body;
  if (!orderId || !telegramUsername)
    return res.status(400).json({ success: false, error: 'Не вистачає даних' });
  // Сохраняем username (не создаём invite ссылки)
  await saveToDB({ orderId, telegramUsername });
  res.json({
    success: true,
    message: 'Дані збережено. Вас додадуть у канал вручну.',
  });
});

/* ---------------- Middleware: simple token auth for admin ----------------- */
function requireAdminToken(req, res, next) {
  // ожидаем заголовок Authorization: Bearer <token>
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).send('Unauthorized');
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer' || parts[1] !== ADMIN_TOKEN)
    return res.status(403).send('Forbidden');
  next();
}

/* ---------------- Admin API (защищённый) ------------------ */

// Получить все оплаченные (и pending если хочешь)
app.get('/api/admin/payments', requireAdminToken, async (req, res) => {
  const db = await readDB();
  // по умолчанию возвращаем все записи; можно фильтровать ?status=paid
  const status = req.query.status;
  const results = status
    ? db.payments.filter(p => p.status === status)
    : db.payments;
  res.json(results);
});

// Пометить как добавленного в канал (admin кликает кнопку на странице)
app.post('/api/admin/mark-added', requireAdminToken, async (req, res) => {
  const { orderId } = req.body;
  if (!orderId)
    return res.status(400).json({ success: false, error: 'orderId required' });
  const db = await readDB();
  const rec = db.payments.find(p => p.orderId === orderId);
  if (!rec) return res.status(404).json({ success: false, error: 'not found' });
  rec.addedToChannel = true;
  rec.addedAt = new Date().toISOString();
  await saveDB(db);
  res.json({ success: true, message: 'Помічено як додане' });
});

/* ---------------- Simple admin page (static html served from server) ----------------- */
/* ВНИМАНИЕ: admin.html загружает список через fetch('/api/admin/payments') с Bearer токеном.
   Не выкладывай ADMIN_TOKEN в публичный код. Храни его в .env на сервере.
*/

app.get('/admin', (req, res) => {
  // отдаём простую страничку — ты заходишь на https://yourdomain/admin
  res.type('html').send(``);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
