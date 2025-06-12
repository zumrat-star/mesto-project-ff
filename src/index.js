import "./pages/index.css";
import { initialCards } from "./scripts/cards.js";
import {
  openPopup,
  closePopup,
  handleEscape,
  handleOverlay,
} from "./components/modal.js";
import { createCard, deleteCard, handleLikeClick } from "./components/card.js";

// DOM элементы
const placesList = document.querySelector(".places__list");
const imagePopup = document.querySelector(".popup_type_image");
const popupImage = imagePopup.querySelector(".popup__image");
const popupCaption = imagePopup.querySelector(".popup__caption");

// Функция открытия попапа с изображением
const openImagePopup = (cardData) => {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openPopup(imagePopup);
};

// Вывод карточек на страницу
initialCards.forEach((cardData) => {
  const newCard = createCard({
    cardData,
    deleteCallback: deleteCard,
    likeCallback: handleLikeClick,
    imageClickCallback: openImagePopup,
  });
  placesList.append(newCard);
});

// Редактирование профиля
const profileName = document.querySelector(".profile__title");
const profileJob = document.querySelector(".profile__description");
const editForm = document.forms["edit-profile"];
const nameInput = editForm.querySelector(".popup__input_type_name");
const jobInput = editForm.querySelector(".popup__input_type_description");
const editPopup = document.querySelector(".popup_type_edit");

// Функция открытия попапа редактирования
const openEditPopup = () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  openPopup(editPopup);
};

// Функция сохранения профиля
const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileJob.textContent = jobInput.value;
  closePopup(editPopup);
};

// Добавление новых карточек
const cardForm = document.forms["new-place"];
const newCardPopup = document.querySelector(".popup_type_new-card");

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();

  const cardData = {
    name: cardForm.elements["place-name"].value,
    link: cardForm.elements.link.value,
  };

  const newCard = createCard({
    cardData,
    deleteCallback: deleteCard,
    likeCallback: handleLikeClick,
    imageClickCallback: openImagePopup,
  });

  placesList.prepend(newCard);
  closePopup(newCardPopup);
  cardForm.reset();
};

// Инициализация попапов
const setupPopups = () => {
  document.querySelectorAll(".popup__close").forEach((button) => {
    const popup = button.closest(".popup");
    button.addEventListener("click", () => closePopup(popup));
  });

  // Открытие попапа редактирования
  document
    .querySelector(".profile__edit-button")
    .addEventListener("click", openEditPopup);

  // Открытие попапа добавления карточки
  document
    .querySelector(".profile__add-button")
    .addEventListener("click", () => {
      openPopup(newCardPopup);
    });

  // Обработчики форм
  editForm.addEventListener("submit", handleProfileFormSubmit);
  cardForm.addEventListener("submit", handleCardFormSubmit);
};

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", setupPopups);
