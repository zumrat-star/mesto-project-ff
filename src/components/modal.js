// Функции управления попапами
const openPopup = (popup) => {
  popup.classList.add("popup_is-opened");
  document.addEventListener("keydown", handleEscape);
  popup.addEventListener("mousedown", handleOverlay);
};

const closePopup = (popup) => {
  popup.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", handleEscape);
  popup.removeEventListener("mousedown", handleOverlay);
};

// Закрытие по Esc
const handleEscape = (evt) => {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    closePopup(openedPopup);
  }
};

// Закрытие по клику на оверлей
const handleOverlay = (evt) => {
  if (evt.target === evt.currentTarget) {
    closePopup(evt.currentTarget);
  }
};

export { openPopup, closePopup, handleEscape, handleOverlay };
