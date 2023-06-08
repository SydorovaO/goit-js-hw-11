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
  searchAPIService
    .fetchInfo()
    .then(hits => {
      console.log(hits);
      return hits.reduce(
        (markup, current) => markup + createMarkup(current),
        ''
      );
    })
    .then(markup => updateList(markup));
}
function onLoadMore() {
  searchAPIService.fetchInfo().then(hits => {
    console.log(hits);
    return hits.reduce((markup, current) => markup + createMarkup(current), '');
  });
}

function createMarkup({
  tags,
  webformatURL,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
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
        `;
}

function appendImages(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
}
function updateList(markup) {
  refs.gallery.innerHTML = markup;
}
// class SearchAPIService {
//   constructor() {
//     this.page = 1;
//     this.searchValue = '';
//   }

//   getImg(query) {
//     const url = `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;
//     return fetch(url)
//       .then(res => res.json())
//       .then(data => {
//         this.incrementPage();
//         return data;
//       });
//   }
//   setSearchValue(query) {
//     this.searchValue = query;
//   }
//   incrementPage() {
//     this.page += 1;
//   }

//   resetPage() {
//     this.page = 1;
//   }
// }

// const serchAPIService = new SearchAPIService();
// refs.form.addEventListener('submit', onSubmit);

// function onSubmit(event) {
//   event.preventDefault();

//   const inputValue = refs.form.elements.searchQuery.value;
//   // const inputValue = refs.form.elements.searchQuery.value.trim();
//   serchAPIService.getImg(inputValue).then(data => {
//     console.log(data.hits);
//   });
// }
// function createMarkup({
//   tags,
//   webformatURL,
//   likes,
//   views,
//   comments,
//   downloads,
// }) {
//   return `
//     <div class="photo-card">
//     <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//     <div class="info">
//       <p class="info-item">
//         <b>Likes ${likes}</b>
//       </p>
//       <p class="info-item">
//         <b>Views ${views}</b>
//       </p>
//       <p class="info-item">
//         <b>Comments ${comments}</b>
//       </p>
//       <p class="info-item">
//         <b>Downloads ${downloads}</b>
//       </p>
//     </div>
//   </div>
//         `;
// }

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
