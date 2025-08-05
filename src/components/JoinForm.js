export function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const userData = {
        firstName: formData.get("firstName").trim(),
        lastName: formData.get("lastName").trim(),
        phone: formData.get("phone").trim(),
        email: formData.get("email").trim(),
    };

    // Простенька валідація (можна розширити)
    if (
        !userData.firstName ||
        !userData.lastName ||
        !userData.phone ||
        !userData.email
    ) {
        alert("Будь ласка, заповніть усі поля.");
        return;
    }

    console.log("Дані користувача:", userData);

    // TODO: тут буде логіка оплати (через payment.js)
    alert("Далі запускаємо оплату...");

    // Після успішної оплати можна редіректити
    // window.location.href = "https://t.me/your_channel"; // замінити на свій
}