import api from './api';

const hackerNews = {
  getTopStories: () => api.get('/topstories'),
  getItem: (id) => api.get(`/item/${id}`),
};

export default hackerNews;