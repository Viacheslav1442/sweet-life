import express from 'express';
import bodyParser from 'body-parser';
import { addContact } from './db.js'; // твой модуль работы с db.json

const app = express();
app.use(bodyParser.json());

// Эндпоинт, который вызывается после оплаты
app.post('/payment-success', (req, res) => {
    try {
        const paymentData = req.body;
        // paymentData может содержать: name, email, phoneNumber и т.д.

        // Формируем контакт
        const newContact = {
            name: paymentData.name,
            phoneNumber: paymentData.phoneNumber,
            email: paymentData.email,
            isFavourite: false,
            contactType: 'personal',
            createdAt: new Date().toISOString(),
        };

        // Добавляем в db.json
        addContact(newContact);

        res.status(200).json({ message: 'Контакт додано після оплати' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Не вдалося додати контакт після оплати' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
