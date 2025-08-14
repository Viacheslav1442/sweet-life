import { openModal, closeModal, initModalCloseOnOutsideClick } from "./components/Modal.js";

document.getElementById("joinBtn").addEventListener("click", openModal);
document.getElementById("closeModal").addEventListener("click", closeModal);

initModalCloseOnOutsideClick();

import { handlePaymentCallback } from './utils/paymentCallback.js';

const form = document.getElementById('paymentForm');
const successMessage = document.getElementById('successMessage');
const modal = document.getElementById('modal');
const telegramLink = document.getElementById('telegramLink');

handlePaymentCallback({ form, successMessage, modal, telegramLink });


