import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';

import ImagesAPIService from './js/ImagesAPIService';
import LoadMoreBtn from './components/loadMoreBtn';

const imagesAPIService = new ImagesAPIService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});
const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', appendImages);
// let inputValue = '';

// function appendImages() {
//   loadMoreBtn.disable();

//   searchAPIService
//     .fetchImages()
//     .then(hits => {
//       console.log(hits);
//       refs.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
//       loadMoreBtn.enable();
//     })

//     .catch(onError)
//     .finally(() => {
//       refs.form.reset();
//     });
// }

async function appendImages() {
  loadMoreBtn.disable();
  const currentPage = imagesAPIService.page;
  console.log(currentPage);
  try {
    const { hits, totalHits } = await imagesAPIService.getImages();

    if (hits.length === 0) {
      onInvalidInput();
    }
    if (currentPage === 1) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }
    const nextPage = imagesAPIService.page;
    const maxPage = Math.ceil(totalHits / 100);
    console.log(maxPage);
    if (nextPage > maxPage) {
      loadMoreBtn.hide();
    }

    console.log(hits);

    refs.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
    loadMoreBtn.enable();
  } catch (err) {
    onError(err);
  }
}

function onSubmit(e) {
  e.preventDefault();
  const inputValue = refs.form.elements.searchQuery.value.trim();

  if (inputValue === '') {
    Notiflix.Notify.warning('Empty query');
    return;
  }
  clearNewsList();
  imagesAPIService.setSearchValue(inputValue);
  loadMoreBtn.show();

  imagesAPIService.resetPage();
  appendImages()
    .catch(onError)
    .finally(() => refs.form.reset());
}

function createMarkup(arr) {
  return arr
    .map(
      ({ tags, webformatURL, likes, views, comments, downloads }) => `
      <div class="photo-card">
      <a class="gallery__link" href="large-image.jpg">
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
      </a>
    </div>
          `
    )
    .join('');
}

function clearNewsList() {
  refs.gallery.innerHTML = '';
}
function onError(err) {
  console.error(' This is err!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  clearNewsList();
  loadMoreBtn.hide();
}
function onInvalidInput() {
  throw new Error(
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    )
  );
  return;
}
// -----------scroll---------------------------------------------------------- //
window.addEventListener('scroll', handleScroll);
function handleScroll() {
  const { clientHeight, scrollTop, scrollHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    appendImages();
  }
}
