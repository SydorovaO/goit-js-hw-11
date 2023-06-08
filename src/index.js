import axios from 'axios';

import SearchAPIService from './js/data-search';
const searchAPIService = new SearchAPIService();

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
let inputValue = '';

function onSubmit(e) {
  e.preventDefault();
  searchAPIService.query = refs.form.elements.searchQuery.value;
  searchAPIService.resetPage();
  appendImages();
}
function onLoadMore() {
  appendImages();
}

function createMarkup(arr) {
  return arr
    .map(
      ({ tags, webformatURL, likes, views, comments, downloads }) => `
      <div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" width=350 height=197 />
      <div class="info">
        <p class="info-item">
          <b class="info-desc"><span >Likes</span> <span>${likes}</span></b>
        </p>
        <p class="info-item">
          <b class="info-desc"><span >Views</span> <span >${views}</span></b>
        </p>
        <p class="info-item">
          <b class="info-desc"><span >Comments</span> <span>${comments}</span></b>
        </p>
        <p class="info-item">
          <b class="info-desc"><span >Downloads</span> <span>${downloads}</span></b>
        </p>
      </div>
    </div>
          `
    )
    .join('');
}
function appendImages() {
  searchAPIService.fetchInfo().then(hits => {
    console.log(hits);
    refs.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
  });
}

// axios.get('/users')
//   .then(res => {
//     console.log(res.data);
//   });
// const axios = require('axios');

// // Делаем запрос пользователя с данным ID
// axios.get('/user?ID=12345')
//   .then(function (response) {
//     // обработка успешного запроса
//     console.log(response);
//   })
//   .catch(function (error) {
//     // обработка ошибки
//     console.log(error);
//   })
//   .finally(function () {
//     // выполняется всегда
//   });

// // По желанию вышеуказанный запрос можно выполнить так
// axios.get('/user', {
//     params: {
//       ID: 12345
//     }
//   })
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (error) {
//     console.log(error);
//   })
//   .finally(function () {
//     // выполняется всегда
//   });

// // Хотите использовать async/await? Добавьте ключевое слово `async` к своей внешней функции/методу.
// async function getUser() {
//   try {
//     const response = await axios.get('/user?ID=12345');
//     console.log(response);
//   } catch (error) {
//     console.error(error);
//   }
// }
