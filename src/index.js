import Notiflix from 'notiflix';
import '/src/css/main.min.css';
import fetchImages from './fetchImages';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const input = document.querySelector('.search-bar-input');
const searchBtn = document.querySelector('.search-bar-btn');
const gallery = document.querySelector('.gallery');
const LoadMoreBtn = document.querySelector('.load-more-btn');
let page = 1;
let gallerySimpleLightbox = new SimpleLightbox('.gallery a');

LoadMoreBtn.style.display = 'none';

searchBtn.addEventListener('click', e => {
  e.preventDefault();
  cleanGallery();
  const trimmed = input.value.trim();
  if (trimmed !== '') {
    fetchImages(trimmed, page).then(foundData => {
      if (foundData.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        renderImageList(foundData.hits);
        Notiflix.Notify.success(
          `Hooray! We found ${foundData.totalHits} images.`
        );
        LoadMoreBtn.style.display = 'block';
        gallerySimpleLightbox.refresh();
      }
    });
  }
});

function renderImageList(images) {
  const markup = images
    .map(image => {
      return `
        <div class="photo-card">
                 <a href="${image.largeImageURL}"><img class="photo" src="${image.webformatURL}" alt="${image.tags}" title="${image.tags}" loading="lazy"/></a>
            <div class="info">
                 <p class="info-item"><b>Likes</b><span class="info-item-data">${image.likes}</span></p>
                 <p class="info-item"><b>Views</b> <span class="info-item-data">${image.views}</span></p>
                 <p class="info-item"><b>Comments</b> <span class="info-item-data">${image.comments}</span></p>
                 <p class="info-item"><b>Downloads</b> <span class="info-item-data">${image.downloads}</span></p>
            </div>
        </div>`;
    })
    .join('');
  gallery.innerHTML += markup;
}

LoadMoreBtn.addEventListener('click', () => {
  page++;
  const trimmed = input.value.trim();
  LoadMoreBtn.style.display = 'none';
  fetchImages(trimmed, page).then(foundData => {
    if (foundData.hits.length === 0) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      renderImageList(foundData.hits);
      LoadMoreBtn.style.display = 'block';
    }
  });
});

function cleanGallery() {
  gallery.innerHTML = '';
  page = 1;
  LoadMoreBtn.style.display = 'none';
}
