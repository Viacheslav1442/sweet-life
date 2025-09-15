import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import url from 'url';

dotenv.config();

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const app = express();

// JSON-база та токен адміна
const DB_FILE = path.join(process.cwd(), 'db.json');
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'change_me';

// Middleware для парсингу JSON
app.use(express.json());

// ======================
// 1️⃣ Ініціалізація та робота з DB
// ======================
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

async function saveDB(data) {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

// ======================
// 2️⃣ Збереження контактів після форми
// ======================
app.post('/api/save-userdata', async (req, res) => {
    const { orderId, telegramUsername, phone, email } = req.body;
    if (!orderId || !telegramUsername)
        return res.status(400).json({ success: false, error: 'Не вистачає даних' });

    const db = await readDB();
    const existing = db.payments.find(p => p.orderId === orderId);

    const record = {
        orderId,
        telegramUsername,
        phone,
        email,
        addedToChannel: false,
        createdAt: new Date().toISOString()
    };

    if (existing) {
        Object.assign(existing, record);
    } else {
        db.payments.push(record);
    }

    await saveDB(db);
    res.json({ success: true });
});

// ======================
// 3️⃣ Middleware для адмінки
// ======================
function requireAdminToken(req, res, next) {
    const auth = req.headers['authorization'];
    if (!auth) return res.status(401).send('Unauthorized');

    const parts = auth.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer' || parts[1] !== ADMIN_TOKEN)
        return res.status(403).send('Forbidden');

    next();
}

// ======================
// 4️⃣ Адмін API
// ======================

// Отримати всі контакти
app.get('/api/admin/payments', requireAdminToken, async (req, res) => {
    const db = await readDB();
    res.json(db.payments);
});

// Позначити контакт як доданий у канал
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
// 5️⃣ Адмінка: відкриття HTML
// ======================
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html')); // index.html у папці admin/
});

// ======================
// 6️⃣ Статичні файли фронтенду
// ======================
app.use(express.static(path.join(process.cwd(), 'src')));

// ======================
// 7️⃣ Запуск сервера
// ======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
