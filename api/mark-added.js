import { promises as fs } from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'db.json');
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

async function readDB() {
    const raw = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(raw);
}

async function saveDB(data) {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const auth = req.headers['authorization'];
    if (!auth || auth !== `Bearer ${ADMIN_TOKEN}`) return res.status(403).json({ error: 'Forbidden' });

    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ success: false, error: 'orderId required' });

    const db = await readDB();
    const rec = db.payments.find(p => p.orderId === orderId);
    if (!rec) return res.status(404).json({ success: false, error: 'not found' });

    rec.addedToChannel = true;
    rec.addedAt = new Date().toISOString();
    await saveDB(db);
    res.json({ success: true });
}
