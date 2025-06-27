// Функция показа ошибки валидации
const showInputError = (form, input, errorMessage, settings) => {
  const errorElement = form.querySelector(`#${input.id}-error`);
  input.classList.add(settings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);
};

// Функция скрытия ошибки валидации
const hideInputError = (form, input, settings) => {
  const errorElement = form.querySelector(`#${input.id}-error`);
  input.classList.remove(settings.inputErrorClass);
  errorElement.classList.remove(settings.errorClass);
  errorElement.textContent = "";
};

// Проверка валидности поля
const checkInputValidity = (form, input, settings) => {
  input.setCustomValidity("");

  // Проверка кастомного паттерна
  if (input.dataset.pattern) {
    const regex = new RegExp(input.dataset.pattern);
    if (input.value && !regex.test(input.value)) {
      input.setCustomValidity(input.dataset.errorMessage);
    }
  }

  // Общая проверка валидности
  if (!input.validity.valid) {
    showInputError(form, input, input.validationMessage, settings);
  } else {
    hideInputError(form, input, settings);
  }
};

// Переключение состояния кнопки
const toggleButtonState = (inputs, button, settings) => {
  const hasInvalidInput = inputs.some((input) => !input.validity.valid);
  button.disabled = hasInvalidInput;
  button.classList.toggle(settings.inactiveButtonClass, hasInvalidInput);
};

// Установка обработчиков событий для формы
const setEventListeners = (form, settings) => {
  const inputs = Array.from(form.querySelectorAll(settings.inputSelector));
  const button = form.querySelector(settings.submitButtonSelector);

  // Инициализация состояния кнопки
  toggleButtonState(inputs, button, settings);

  // Обработчики для каждого поля ввода
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      checkInputValidity(form, input, settings);
      toggleButtonState(inputs, button, settings);
    });
  });
};

// Включение валидации всех форм
export const enableValidation = (settings) => {
  const forms = Array.from(document.querySelectorAll(settings.formSelector));
  forms.forEach((form) => setEventListeners(form, settings));
};

// Очистка ошибок валидации
export const clearValidation = (form, settings) => {
  const inputs = Array.from(form.querySelectorAll(settings.inputSelector));
  const button = form.querySelector(settings.submitButtonSelector);

  inputs.forEach((input) => {
    input.setCustomValidity("");
    hideInputError(form, input, settings);
  });

  toggleButtonState(inputs, button, settings);
};
