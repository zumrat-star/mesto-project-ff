import "./pages/index.css";
import { openPopup, closePopup } from "./components/modal.js";
import { createCard} from "./components/card.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import { Api } from "./components/api.js";

// Конфигурация API
const apiConfig = {
  baseUrl: "https://mesto.nomoreparties.co/v1/wff-cohort-41",
  headers: {
    authorization: "a866e48f-2a08-45a7-a25c-53920d318a13",
    "Content-Type": "application/json",
  },
};

const api = new Api(apiConfig);

// Конфигурация валидации
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// Тексты кнопок для разных состояний
const BUTTON_TEXTS = {
  SAVE: "Сохранить",
  CREATE: "Создать",
  CONFIRM: "Да",
  SAVING: "Сохранение...",
  CREATING: "Создание...",
  CONFIRMING: "Удаление...",
};

// DOM элементы
const elements = {
  placesList: document.querySelector(".places__list"),
  imagePopup: document.querySelector(".popup_type_image"),
  popupImage: document.querySelector(".popup_type_image .popup__image"),
  popupCaption: document.querySelector(".popup_type_image .popup__caption"),
  profileName: document.querySelector(".profile__title"),
  profileJob: document.querySelector(".profile__description"),
  profileAvatar: document.querySelector(".profile__image"),
  editForm: document.forms["edit-profile"],
  nameInput: document.querySelector(".popup__input_type_name"),
  jobInput: document.querySelector(".popup__input_type_description"),
  editPopup: document.querySelector(".popup_type_edit"),
  deleteConfirmationPopup: document.querySelector(".popup_type_confirm-delete"),
  deleteForm: document.forms["confirm-delete"],
  editAvatarPopup: document.querySelector(".popup_type_edit-avatar"),
  editAvatarForm: document.forms["edit-avatar"],
  avatarInput: document.forms["edit-avatar"].elements.avatar,
  avatarEditButton: document.querySelector(".profile__avatar-edit-button"),
  cardForm: document.forms["new-place"],
  newCardPopup: document.querySelector(".popup_type_new-card"),
  addButton: document.querySelector(".profile__add-button"),
  editButton: document.querySelector(".profile__edit-button"),
  submitButton:document.querySelector(".popup__button")
};

// Состояние приложения
let currentUserId = null;
let cardToDeleteId = null;
let cardElementToDelete = null;

// Инициализация приложения
const initializeApp = () => {
  enableValidation(validationConfig);
  setupEventListeners();
  loadInitialData();
};

// ====================== Функции работы с данными ======================

// Загрузка данных пользователя и карточек
const loadInitialData = () => {
  Promise.all([api.getUserInfo(), api.getInitialCards()])
    .then(([userData, cards]) => {
      currentUserId = userData._id;
      updateProfileInfo(userData);
      renderInitialCards(cards);
    })
    .catch((error) => {
      console.error("Ошибка загрузки данных:", error);
    });
};

// Обновление информации профиля
const updateProfileInfo = (userData) => {
  elements.profileName.textContent = userData.name;
  elements.profileJob.textContent = userData.about;
  elements.profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
};

// Отрисовка карточек
const renderInitialCards = (cards) => {
  elements.placesList.innerHTML = "";

  cards.forEach((cardData) => {
    const cardElement = createCard({
      cardData,
      currentUserId,
      deleteCallback: deleteCard,
      likeCallback: handleLikeClick,
      imageClickCallback: openImagePopup,
    });
    elements.placesList.append(cardElement);
  });
};

// ====================== Функции работы с UI ======================

// Открытие попапа с изображением
const openImagePopup = (cardData) => {
  elements.popupImage.src = cardData.link;
  elements.popupImage.alt = cardData.name;
  elements.popupCaption.textContent = cardData.name;
  openPopup(elements.imagePopup);
};

// Открытие попапа редактирования профиля
const openEditPopup = () => {
  elements.nameInput.value = elements.profileName.textContent;
  elements.jobInput.value = elements.profileJob.textContent;
  clearValidation(elements.editForm, validationConfig);
  openPopup(elements.editPopup);
};

// Открытие попапа редактирования аватара
const openEditAvatarPopup = () => {
  elements.editAvatarForm.reset();
  clearValidation(elements.editAvatarForm, validationConfig);
  openPopup(elements.editAvatarPopup);
};

// Открытие попапа подтверждения удаления
const openDeleteConfirmationPopup = (cardElement, cardId) => {
  cardToDeleteId = cardId;
  cardElementToDelete = cardElement;
  openPopup(elements.deleteConfirmationPopup);
};

// ====================== Обработчики событий ======================

// Обработчик удаления карточки
const deleteCard = (cardElement, cardId) => {
  openDeleteConfirmationPopup(cardElement, cardId);
};

// Обработчик отправки формы профиля
const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  const initialText = submitButton.textContent;
  submitButton.textContent = BUTTON_TEXTS.SAVING;
  submitButton.disabled = true;

  const name = elements.editForm.elements.name.value;
  const about = elements.editForm.elements.description.value;

  api
    .updateUserInfo({ name, about })
    .then((userData) => {
      updateProfileInfo(userData);
      closePopup(elements.editPopup);
    })
    .catch((error) => {
      console.error("Ошибка обновления профиля:", error);
    })
    .finally(() => {
      submitButton.textContent = initialText;
      submitButton.disabled = false;
    });
};

// Обработчик отправки формы аватара
const handleEditAvatarFormSubmit = (evt) => {
  evt.preventDefault();
  const initialText = submitButton.textContent;
  submitButton.textContent = BUTTON_TEXTS.SAVING;
  submitButton.disabled = true;

  const avatarUrl = elements.avatarInput.value;

  api
    .updateUserAvatar(avatarUrl)
    .then((userData) => {
      elements.profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closePopup(elements.editAvatarPopup);
    })
    .catch((err) => {
      console.error("Ошибка обновления аватара:", err);
    })
    .finally(() => {
      submitButton.textContent = initialText;
      submitButton.disabled = false;
    });
};

// Обработчик отправки формы карточки
const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  const initialText = submitButton.textContent;
  submitButton.textContent = BUTTON_TEXTS.CREATING;
  submitButton.disabled = true;

  const placeName = elements.cardForm.elements["place-name"].value;
  const link = elements.cardForm.elements.link.value;

  api
    .addCard({ name: placeName, link })
    .then((cardData) => {
      const newCard = createCard({
        cardData,
        deleteCallback: deleteCard,
        likeCallback: handleLikeClick,
        imageClickCallback: openImagePopup,
        currentUserId,
      });

      elements.placesList.prepend(newCard);
      closePopup(elements.newCardPopup);
      elements.cardForm.reset();
    })
    .catch((error) => {
      console.error("Ошибка добавления карточки:", error);
    })
    .finally(() => {
      submitButton.textContent = initialText;
      submitButton.disabled = false;
    });
};

// Обработчик подтверждения удаления
const handleDeleteConfirmSubmit = (evt) => {
  evt.preventDefault();
  const initialText = submitButton.textContent;
  submitButton.textContent = BUTTON_TEXTS.CONFIRMING;
  submitButton.disabled = true;

  api
    .deleteCard(cardToDeleteId)
    .then(() => {
      cardElementToDelete.remove();
      closePopup(elements.deleteConfirmationPopup);
    })
    .catch((err) => {
      console.error("Ошибка удаления карточки:", err);
    })
    .finally(() => {
      submitButton.textContent = initialText;
      submitButton.disabled = false;
    });
};

// ====================== Настройка обработчиков событий ======================

const setupEventListeners = () => {
  // Кнопки открытия попапов
  elements.avatarEditButton.addEventListener("click", openEditAvatarPopup);
  elements.editButton.addEventListener("click", openEditPopup);
  elements.addButton.addEventListener("click", () => {
    elements.cardForm.reset();
    clearValidation(elements.cardForm, validationConfig);
    openPopup(elements.newCardPopup);
  });

  // Обработчики форм
  elements.editForm.addEventListener("submit", handleProfileFormSubmit);
  elements.editAvatarForm.addEventListener("submit", handleEditAvatarFormSubmit);
  elements.cardForm.addEventListener("submit", handleCardFormSubmit);
  elements.deleteForm.addEventListener("submit", handleDeleteConfirmSubmit);

  // Закрытие попапов
  document.querySelectorAll(".popup__close").forEach((button) => {
    const popup = button.closest(".popup");
    button.addEventListener("click", () => closePopup(popup));
  });

  // Закрытие по клику на оверлей
  document.querySelectorAll(".popup").forEach((popup) => {
    popup.addEventListener("mousedown", (evt) => {
      if (evt.target === popup) {
        closePopup(popup);
      }
    });
  });
};

// Запуск приложения
document.addEventListener("DOMContentLoaded", initializeApp);
