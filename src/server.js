import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import url from 'url';

dotenv.config();
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const app = express();

const DB_FILE = path.join(process.cwd(), 'db.json');
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'change_me';

app.use(express.json());

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
// Адмінка HTML
// ======================
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

// ======================
// Статика фронтенду
// ======================
app.use(express.static(path.join(process.cwd(), 'src')));

// ======================
// Запуск сервера
// ======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
