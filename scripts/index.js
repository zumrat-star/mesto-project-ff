// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;
// @todo: DOM узлы

// @todo: Функция создания карточки
function createCard(cardData, deleteCard) {
  const cardElement = cardTemplate
    .cloneNode(true)
    .querySelector(".places__item");

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardImage.src = cardData.link;
  cardTitle.textContent = cardData.name;
  cardImage.alt = cardData.name;

  deleteButton.addEventListener("click", () => {
    deleteCard(cardElement);
  });

  return cardElement;
}
// @todo: Функция удаления карточки
function deleteCard(cardElement) {
  cardElement.remove();
}
// @todo: Вывести карточки на страницу
const placesList = document.querySelector(".places__list");
initialCards.forEach((cardData) => {
  const newCard = createCard(cardData, deleteCard);
  placesList.append(newCard);
});
