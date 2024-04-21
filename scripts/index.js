// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы
const content = document.querySelector('.content');
const placesList = document.querySelector('.places__list');

// @todo: Функция создания карточки
//дописать функцию для кнопки
function createCard(name, link, deleteCard) {
  const card = cardTemplate.querySelector('.card').cloneNode(true);
  const deleteButton = card.querySelector('.card__delete-button');
  //заполняем данные карточки
  card.querySelector('.card__image').src = link;
  card.querySelector('.card__title').textContent = name;
  
  //обработчик клика для удаления карточки колбэком
  deleteButton.addEventListener('click', function() {
  deleteCard(card)
  });
  return card;
};

// @todo: Вывести карточки на страницу
initialCards.forEach((item) => {
    placesList.append(createCard(item.name, item.link, deleteCard));
  });
  
// @todo: Функция удаления карточки
function deleteCard(item) {
    item.remove();
};




