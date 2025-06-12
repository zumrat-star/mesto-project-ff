// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;
// @todo: Функция создания карточки
const createCard = (options) => {
  const { cardData, deleteCallback, likeCallback, imageClickCallback } =
    options;

  const cardElement = cardTemplate.cloneNode(true).querySelector(".card");
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");

  cardImage.src = cardData.link;
  cardTitle.textContent = cardData.name;
  cardImage.alt = cardData.name;

  // Обработчики событий
  likeButton.addEventListener("click", likeCallback);
  deleteButton.addEventListener("click", () => deleteCallback(cardElement));
  cardImage.addEventListener("click", () => imageClickCallback(cardData));

  return cardElement;
};

//функция обработчик лайка
const handleLikeClick = (evt) => {
  evt.currentTarget.classList.toggle("card__like-button_is-active");
};
//Функция удаления карточки
const deleteCard = (cardElement) => {
  cardElement.remove();
};

export { createCard, deleteCard, handleLikeClick };
