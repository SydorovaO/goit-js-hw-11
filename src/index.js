import axios from 'axios';
import SimpleLightbox from 'simplelightbox';

import SearchAPIService from './js/img-search';
import LoadMoreBtn from './components/loadMoreBtn';

const searchAPIService = new SearchAPIService();
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

  try {
    searchAPIService.fetchImages().then(hits => {
      console.log(hits);
      refs.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
      loadMoreBtn.enable();
    });
  } catch {
    onError;
  }

  refs.form.reset();
}

function onSubmit(e) {
  e.preventDefault();
  loadMoreBtn.show();
  searchAPIService.query = refs.form.elements.searchQuery.value.trim();
  if (searchAPIService.query === '') {
    alert('Empty query!');
    return;
  }
  clearNewsList();
  searchAPIService.resetPage();
  appendImages();
}

// function onLoadMore() {
//   appendImages();
// }
// pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp

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
  console.error(err);
  createMarkup(`<p>${err.message}</p>`);
}
