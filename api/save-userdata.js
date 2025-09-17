import { promises as fs } from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'db.json');

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

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { orderId, telegramUsername, phone, email } = req.body;
    if (!orderId || !telegramUsername)
        return res.status(400).json({ success: false, error: 'Не вистачає даних' });

    const db = await readDB();
    const existing = db.payments.find(p => p.orderId === orderId);
    const record = { orderId, telegramUsername, phone, email, addedToChannel: false, createdAt: new Date().toISOString() };

    if (existing) Object.assign(existing, record);
    else db.payments.push(record);

    await saveDB(db);
    res.json({ success: true });
}
