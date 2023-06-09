import axios from 'axios';
const API_KEY = '37102228-8afdc053099dfecff6bc66ec6';
const BASE_URL = 'https://pixabay.com/api/';

export default class ImagesAPIService {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
  }

  // fetchImages() {
  //   const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=100`;
  //   return axios.get(url).then(response => {
  //     const { hits } = response.data;
  //     this.incrementPage();
  //     return hits;
  //   });
  // }
  async getImages() {
    const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=100`;

    const response = await axios.get(url);
    this.incrementPage();
    console.log(response.data);
    return response.data;
  }

  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }

  setQuery(newQuery) {
    this.searchQuery = newQuery;
  }
}
