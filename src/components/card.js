// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;
// @todo: Функция создания карточки
function createCard(cardData, deleteCard, likeHandler, imageClickHandler) {
  const cardElement = cardTemplate.cloneNode(true).querySelector(".card");

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");

  cardImage.src = cardData.link;
  cardTitle.textContent = cardData.name;
  cardImage.alt = cardData.name;

  likeButton.addEventListener("click", likeHandler);

  deleteButton.addEventListener("click", () => deleteCard(cardElement));

  cardImage.addEventListener("click", () => imageClickHandler(cardData));

  return cardElement;
}

//функция обработчик лайка
function handleLikeClick(evt) {
  evt.currentTarget.classList.toggle("card__like-button_is-active");
}
//Функция удаления карточки
function deleteCard(cardElement) {
  cardElement.remove();
}

export { createCard, handleLikeClick, deleteCard };
