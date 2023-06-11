import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
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
};
const { form, gallery } = refs;

form.addEventListener('submit', onSubmit);
loadMoreBtn.button.addEventListener('click', onLoadMore);

async function appendImages() {
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
    gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
    smoothScrollToNextCards();
    new SimpleLightbox('.gallery a', {
      captions: true,
      captionDelay: 250,
    });
  } catch (err) {
    onError(err);
  }
  loadMoreBtn.enable();
}

function onLoadMore() {
  loadMoreBtn.disable();
  appendImages();
  gallery.refresh();
}

function onSubmit(e) {
  e.preventDefault();
  const inputValue = form.elements.searchQuery.value.trim();

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
    .finally(() => form.reset());
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        tags,
        largeImageURL,
        webformatURL,
        likes,
        views,
        comments,
        downloads,
      }) => `
      
      <div class="photo-card">
      <a class="gallery__link" href="${largeImageURL}">
      <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
      </a>

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
// width=350 height=197
function clearNewsList() {
  gallery.innerHTML = '';
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

function smoothScrollToNextCards() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

// -----------scroll---------------------------------------------------------- //
window.addEventListener('scroll', handleScroll);
function handleScroll() {
  const { clientHeight, scrollTop, scrollHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    appendImages();
  }
}
