import "../pages/index.css";
import { cardTemplate, createCard, deleteCard, likeHandler } from "./card.js";
import { openModal, closeModal } from "./modal.js";
import {  enableValidation, clearValidation } from "./validation.js";
import { getUserInfo, getCard, patchUserInfo, patchAvatar, postNewCard } from "./api.js";

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "button_disabled",
  inputErrorClass: "form__input_type_error",
  errorClass: "form__input-error_active",
};

// @done: DOM узлы
const cardsContainer = document.querySelector(".places__list");
const buttonOpenEditProfile = document.querySelector(".profile__edit-button");
const editPopup = document.querySelector(".popup_type_edit");
const buttonOpenAddCard = document.querySelector(".profile__add-button");
const addPopup = document.querySelector(".popup_type_new-card");
//Форма редактирования профиля
const formEditProfile = document.forms["edit-profile"];
const nameInput = formEditProfile.elements.name;
const descriptionInput = formEditProfile.elements.description;
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileFormSubmitButton = formEditProfile.querySelector(".popup__button");
//Форма добавления карточки
const formNewPlace = document.forms["new-place"];
const placeNameInput = formNewPlace.elements["place-name"];
const linkInput = formNewPlace.elements.link;
const cardFormSubmitButton = formNewPlace.querySelector(".popup__button");
//Форма редактирования аватара
const popupAvatarEdit = document.querySelector(".popup_type_avatar");
const avatar = document.querySelector(".profile__image");
const formAvatar = document.forms["new-avatar"];
const avatarLinkInput = formAvatar.elements.link;
const avatarFormSubmitButton = formAvatar.querySelector(".popup__button");
const popupAvatarEditOpen = document.querySelector(".profile__image_cover");
const formEdit = document.querySelector('form[name="edit-profile"]');
//Попап картинки(карточки)
const imagePopup = document.querySelector(".popup_type_image");
const imageInPopup = imagePopup.querySelector(".popup__image");
const imagePopupCaption = imagePopup.querySelector(".popup__caption");
//Закрытие попапов
const closeButtons = document.querySelectorAll(".popup__close");

// @done: Функция для обаботчика события submit  отображения имени в форме
function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  loading(true, profileFormSubmitButton);
  patchUserInfo(nameInput.value, descriptionInput.value)
    .then((res) => {
      profileTitle.textContent = res.name;
      profileDescription.textContent = res.about;
      closeModal(editPopup);
    })
    .catch((error) => {
      console.log(`Error in edit profile! Status: ${error}`);
    })
    .finally(() => {
      loading(false, profileFormSubmitButton);
    });
}

// @done: Функция для обаботчика события submit формы добавления карточки
function handleNewPlaceSubmit(evt) {
  evt.preventDefault();
  loading(true, cardFormSubmitButton);
  const name = placeNameInput.value;
  const link = linkInput.value;
  postNewCard(name, link)
    .then((element) => {
      const newCard = createCard(cardTemplate, element, deleteCard, likeHandler, openCard, userId);
      cardsContainer.prepend(newCard);
      clearValidation(formNewPlace, validationConfig);
      closeModal(addPopup);
      formNewPlace.reset();
    })
    .catch((error) => {
      console.log(`Error in new place! Status: ${error}`);
    })
    .finally(() => {
      loading(false, cardFormSubmitButton);
    });
}

// @done: Функция для обаботчика события submit формы изменения аватара
const handleFormEditAvatarSubmit = (evt) => {
  evt.preventDefault();
  loading(true, avatarFormSubmitButton);
  patchAvatar(avatarLinkInput.value)
    .then((res) => {
      avatar.style.backgroundImage = `url('${res.avatar}')`;
      closeModal(popupAvatarEdit);
    })
    .catch((error) => {
      console.log(`Error in edit avatar! Status: ${error}`);
    })
    .finally(() => {
      loading(false, avatarFormSubmitButton);
    });
};

// @done: Функция открытия попапа
function openEditProfilePopup() {
  nameInput.value = profileTitle.textContent;
  descriptionInput.value = profileDescription.textContent;
  clearValidation(formEditProfile, validationConfig);
  openModal(editPopup);
}

// @done: Функция открытия попапа карточки
function openCard(cardName, imageSrc) {
  openModal(imagePopup);
  imageInPopup.src = imageSrc;
  imageInPopup.alt = cardName;
  imagePopupCaption.textContent = cardName;
}

//Пока ожидаем ответ сервера добавляес три точки
function loading(isLoading, button) {
  button.textContent = isLoading ? "Сохранение..." : "Сохранить";
}

//@done: загружаем с сервера
let userId;
Promise.all([getCard(), getUserInfo()])
  .then(([listCard, userData]) => {
    profileDescription.textContent = userData.about;
    profileTitle.textContent = userData.name;
    avatar.style = `background-image: url('${userData.avatar}')`;
    userId = userData._id;
    listCard.forEach((element) => {
      cardsContainer.append(
        createCard(cardTemplate, element, deleteCard, likeHandler, openCard, userId)
      );
    });
  })
  .catch((error) => {
    console.error(`Error in server! Status: ${error}`);
  });

// Обработчики
formEditProfile.addEventListener("submit", handleEditProfileSubmit);
formNewPlace.addEventListener("submit", handleNewPlaceSubmit);
formAvatar.addEventListener("submit", handleFormEditAvatarSubmit);
buttonOpenEditProfile.addEventListener("click", () => {
  clearValidation(formEditProfile, validationConfig);
  openEditProfilePopup();
});
buttonOpenAddCard.addEventListener("click", () => {
  clearValidation(formNewPlace, validationConfig);
  openModal(addPopup);
});
popupAvatarEditOpen.addEventListener("click", () => {
  clearValidation(formEdit, validationConfig);
  openModal(popupAvatarEdit);
  formAvatar.reset();
});
// Обработчик закрытия попапов по клику на крестик
closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const popup = button.closest(".popup");
    closeModal(popup);
  });
});

enableValidation(validationConfig);
