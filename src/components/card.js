import { deleteOwnCard, putLike, deleteLike } from "./api.js";

// @done: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// @done: Функция создания карточки
function createCard(cardTemplate, data, deleteCard, likeHandler, openCard, userId) {
  const card = cardTemplate.querySelector(".card").cloneNode(true);
  const deleteButton = card.querySelector(".card__delete-button");
  const likeButton = card.querySelector(".card__like-button");
  const cardImage = card.querySelector(".card__image");
  const likeCount = card.querySelector(".card__like-number");
  //заполняем данные карточки
  const dataCardID = data._id;
  cardImage.src = data.link;
  cardImage.alt = data.name;
  card.querySelector(".card__title").textContent = data.name;

  if (data.owner._id === userId) {
    deleteButton.addEventListener("click", (evt) =>
      deleteCard(evt, dataCardID)
    );
  } else {
    deleteButton.style.display = "none";
  }

  const isLiked = data.likes.some((element) => {
    return element._id === userId;
  });

  if (isLiked) {
    likeButton.classList.add("card__like-button_is-active");
  }

  likeCount.textContent = data.likes.length;

  likeButton.addEventListener("click", (evt) => {
    likeHandler(evt, dataCardID, likeCount);
  });

  cardImage.addEventListener("click", () => {
    openCard(data.name, data.link);
  });

  return card;
}

// @done: Функция удаления карточки
function deleteCard(evt, id) {
  Promise.all([deleteOwnCard(id), deleteLike(id)])
    .then(() => {
      evt.target.closest(".places__item").remove();
    })
    .catch((error) => {
      console.log(error);
    });
}

// @done: Функция лайка
function likeHandler(evt, id, count) {
  const like = evt.target.classList.contains("card__like-button_is-active")
    ? deleteLike
    : putLike;
  like(id)
    .then((data) => {
      evt.target.classList.toggle("card__like-button_is-active");
      count.textContent = data.likes.length;
    })
    .catch((error) => {
      console.log(error);
    });
}

export { cardTemplate, createCard, deleteCard, likeHandler };
