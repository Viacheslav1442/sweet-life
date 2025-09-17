import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const DB_FILE = path.join(process.cwd(), 'db.json');
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'change_me';

async function readDB() {
    const raw = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(raw);
}

export default async function handler(req, res) {
    const auth = req.headers['authorization'];
    if (!auth || auth !== `Bearer ${ADMIN_TOKEN}`) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    if (req.method === 'GET') {
        const db = await readDB();
        return res.status(200).json(db.payments || []);
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
