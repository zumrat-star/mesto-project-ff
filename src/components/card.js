// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;
// @todo: Функция создания карточки
const createCard = (options) => {
  const {
    cardData,
    deleteCallback,
    likeCallback,
    imageClickCallback,
    currentUserId,
  } = options;

  const cardElement = cardTemplate.cloneNode(true).querySelector(".card");
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCountElement = cardElement.querySelector(".card__like-count");

  cardImage.src = cardData.link;
  cardTitle.textContent = cardData.name;
  cardImage.alt = cardData.name;

  // Устанавливаем количество лайков
  likeCountElement.textContent = cardData.likes.length || 0;

  // Показываем иконку удаления только для своих карточек
  if (cardData.owner._id !== currentUserId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener("click", () => {
      deleteCallback(cardElement, cardData._id);
    });
  }

  // Проверяем, лайкнул ли текущий пользователь
  const isLiked = cardData.likes.some((like) => like._id === currentUserId);
  if (isLiked) {
    likeButton.classList.add("card__like-button_is-active");
  }

  // Обработчики событий
  likeButton.addEventListener("click", () => {
    likeCallback(cardData._id, isLiked, likeButton, likeCountElement);
  });
  cardImage.addEventListener("click", () => imageClickCallback(cardData));
  return cardElement;
};

export { createCard };
