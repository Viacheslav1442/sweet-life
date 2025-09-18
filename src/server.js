import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import url from 'url';
import LiqPay from 'liqpay-nodejs'; // ✅ LiqPay SDK

dotenv.config();
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const app = express();

const DB_FILE = path.join(process.cwd(), 'db.json');
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'change_me';

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // потрібно для callback

// ======================
// DB
// ======================
async function initDB() {
    try { await fs.access(DB_FILE); }
    catch { await fs.writeFile(DB_FILE, JSON.stringify({ payments: [] }, null, 2)); }
}

async function readDB() { await initDB(); return JSON.parse(await fs.readFile(DB_FILE, 'utf8')); }
async function saveDB(data) { await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2)); }

// ======================
// Збереження контактів після оплати
// ======================
app.post('/api/save-userdata', async (req, res) => {
    const { orderId, telegramUsername, phone, email } = req.body;
    if (!orderId || !telegramUsername) return res.status(400).json({ success: false, error: 'Не вистачає даних' });

    const db = await readDB();
    const existing = db.payments.find(p => p.orderId === orderId);
    const record = { orderId, telegramUsername, phone, email, addedToChannel: false, createdAt: new Date().toISOString() };

    if (existing) Object.assign(existing, record);
    else db.payments.push(record);

    await saveDB(db);
    res.json({ success: true });
});

// ======================
// Middleware адміна
// ======================
function requireAdminToken(req, res, next) {
    const auth = req.headers['authorization'];
    if (!auth) return res.status(401).send('Unauthorized');

    const parts = auth.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer' || parts[1] !== ADMIN_TOKEN) return res.status(403).send('Forbidden');

    next();
}

// ======================
// Адмін API
// ======================
app.get('/api/admin/payments', requireAdminToken, async (req, res) => {
    const db = await readDB();
    res.json(db.payments);
});

app.post('/api/admin/mark-added', requireAdminToken, async (req, res) => {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ success: false, error: 'orderId required' });

    const db = await readDB();
    const rec = db.payments.find(p => p.orderId === orderId);
    if (!rec) return res.status(404).json({ success: false, error: 'not found' });

    rec.addedToChannel = true;
    rec.addedAt = new Date().toISOString();
    await saveDB(db);
    res.json({ success: true });
});

// ======================
// LiqPay
// ======================
import crypto from "crypto";

const liqpay = new LiqPay(
    process.env.LIQPAY_PUBLIC_KEY,
    process.env.LIQPAY_PRIVATE_KEY
);

// функція створення підпису
function createSignature(data) {
    return crypto
        .createHash("sha1")
        .update(process.env.LIQPAY_PRIVATE_KEY + data + process.env.LIQPAY_PRIVATE_KEY)
        .digest("base64");
}

// створення форми оплати
app.get('/api/pay', (req, res) => {
    const { amount = "279", description = "Оплата доступу" } = req.query;

    const html = liqpay.cnb_form({
        action: "pay",
        amount,
        currency: "UAH",
        description,
        order_id: Date.now(),
        version: "3",
        server_url: `${process.env.BASE_URL}/liqpay-callback` // ✅ LiqPay викликає цей URL після оплати
    });

    res.send(html);
});

// callback після оплати
app.post('/liqpay-callback', async (req, res) => {
    try {
        const { data, signature } = req.body;
        if (!data || !signature) {
            return res.status(400).json({ success: false, error: "Missing data or signature" });
        }

        // перевірка підпису
        const expectedSignature = createSignature(data);
        if (signature !== expectedSignature) {
            return res.status(403).json({ success: false, error: "Invalid signature" });
        }

        // розшифровка даних
        const decoded = JSON.parse(Buffer.from(data, "base64").toString("utf8"));
        console.log("📩 LiqPay callback:", decoded);

        // беремо тільки успішні
        if (decoded.status === "success" || decoded.status === "sandbox") {
            const db = await readDB();

            const newPayment = {
                orderId: decoded.order_id,
                amount: decoded.amount,
                currency: decoded.currency,
                description: decoded.description,
                status: decoded.status,
                createdAt: new Date().toISOString(),
                addedToChannel: false
            };

            db.payments.push(newPayment);
            await saveDB(db);
        }

        res.sendStatus(200);
    } catch (err) {
        console.error("❌ Callback error:", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
});
