// Функции управления попапами
function openPopup(popup) {
  popup.classList.add("popup_is-opened");
  document.addEventListener("keydown", handleEscape);
  popup.addEventListener("mousedown", handleOverlay);
}

function closePopup(popup) {
  popup.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", handleEscape);
  popup.removeEventListener("mousedown", handleOverlay);
}

// Закрытие по Esc
function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    closePopup(openedPopup);
  }
}

// Закрытие по клику на оверлей
function handleOverlay(evt) {
  if (evt.target === evt.currentTarget) {
    closePopup(evt.currentTarget);
  }
}

export { openPopup, closePopup, handleEscape, handleOverlay };
