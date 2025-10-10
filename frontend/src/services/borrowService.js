import api from './api.js';

export default {
  // Get all borrow records
  getAll() {
    return api.get('/borrows');
  },

  // Get borrow record by ID
  getById(id) {
    return api.get(`/borrows/${id}`);
  },

  // Get currently borrowed books
  getCurrentlyBorrowed() {
    return api.get('/borrows/currently-borrowed');
  },

  // Get returned books
  getReturned() {
    return api.get('/borrows/returned');
  },

  // Get borrowing statistics
  getStatistics() {
    return api.get('/borrows/statistics');
  },

  // Borrow a book
  borrowBook(data) {
    return api.post('/borrows/borrow', data);
  },

  // Return a book
  returnBook(id) {
    return api.put(`/borrows/return/${id}`);
  }
};