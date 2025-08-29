import { initiatePayment } from '../services/payment.js';

export function validateForm({ firstName, lastName, phone, email }) {
    // Перевірка, чи заповнені всі поля
    if (!firstName || !lastName || !phone || !email) {
        alert("Будь ласка, заповніть усі поля.");
        return false;
    }

    // Перевірка формату email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Будь ласка, введіть коректний email.");
        return false;
    }

    // Перевірка формату телефону (наприклад, +380xxxxxxxxx)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
        alert("Будь ласка, введіть коректний номер телефону.");
        return false;
    }

    // Перевірка довжини імен
    if (firstName.length < 2 || lastName.length < 2) {
        alert("Ім'я та прізвище повинні містити принаймні 2 символи.");
        return false;
    }

    return true;
}

export async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const userData = {
        firstName: formData.get("firstName").trim(),
        lastName: formData.get("lastName").trim(),
        phone: formData.get("phone").trim(),
        email: formData.get("email").trim(),
    };

    if (!validateForm(userData)) {
        return;
    }

    try {
        await initiatePayment(userData.firstName, userData.lastName, userData.phone);
        console.log("Оплата ініційована");
    } catch (error) {
        console.error("Помилка оплати:", error);
        alert("Сталася помилка під час обробки.");
    }
}