"use strict";
//==========================================

async function submitForm(event) {
  event.preventDefault();
  const form = event.target;
  const formBtn = document.querySelector(".form__btn");
  const formSendResult = document.querySelector(".form__send-result");
  formSendResult.textContent = "";

  // Получение данных из формы
  const formData = new FormData(form);
  const formDataObject = {};

  formData.forEach((value, key) => {
    formDataObject[key] = value.trim().replace(/\s+/g, " ");
  });

  // Валидация полей на клиенте
  const validationErrors = validateForm(formDataObject);

  // Обновление интерфейса для отображения ошибок
  displayErrors(validationErrors);
  if (validationErrors.length > 0) return;

  // Отправка формы на бэк
  sendFormData(form, formBtn, formSendResult, formDataObject);

}

async function sendFormData(form, formBtn, formSendResult, formDataObject) {

    try {
        formBtn.textContent = 'Loading...';
        formBtn.disabled = true;

        const response = await fetch('http://localhost:5000/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataObject),
        });

        if (response.ok) {
            formSendResult.textContent = 'Thank you for your message!';
            form.reset();
        } else if (response.status === 422) {
            const errors = await response.json();
            console.log(errors);
            throw new Error('Ошибка валидации данных');
        } else {
            throw new Error(response.statusText);
        }

    } catch (error) {
        console.error(error.message);
        formSendResult.textContent = 'Letter not sent! Try again later.';
        formSendResult.style.color = 'red';

    } finally {
        formBtn.textContent = 'Send';
        formBtn.disabled = false;
    }
}



function validateForm(formData) {
  const { name, email, phone, message } = formData;

  const phoneRegex = /^\+[0-9]{5,15}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const errors = [];

  if (!name) {
    errors.push({ field: "name", message: "Please enter your name" });
  } else if (name.length < 5 || name.length > 20) {
    errors.push({
      field: "name",
      message:
        "Please enter correct name",
    });
  }

  if (!phone) {
    errors.push({
      field: "phone",
      message: "Please enter yuor phone number",
    });
  } else if (!phoneRegex.test(phone)) {
    errors.push({
      field: "phone",
      message:
        "Please enter correct phone PVZ:+(code)(number)",
    });
  }

  if (!email) {
    errors.push({
      field: "email",
      message: "Please enter your email",
    });
  } else if (
    !emailRegex.test(email) ||
    email.length < 5 ||
    email.length > 100
  ) {
    errors.push({
      field: "email",
      message:
        "Please enter correct email PVZ: email@gmail.com",
    });
  }

  if (!message) {
    errors.push({
      field: "message",
      message: "Please enter message",
    });
  } else if (message.length < 20 || message.length > 400) {
    errors.push({
      field: "message",
      message: "Please enter correct message",
    });
  }

  return errors;
}

function displayErrors(errors) {
    // Скрытие всех ошибок перед отображением новых
    const errorElements = document.querySelectorAll('.form__error');
    errorElements.forEach((errorElement) => {
        errorElement.textContent = '';
    });

    if(errors.length < 1) return;

    // Отображение ошибок для соответствующих полей
    errors.forEach((error) => {
        const { field, message } = error;
        const errorElement = document.querySelector(`[data-for="${field}"]`);
        errorElement.textContent = message;
    });
}
