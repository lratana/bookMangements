import api from './api.js';

export default {
    // Get all books
    getAll() {
        return api.get('/books');
    },

    // Get book by ID
    getById(id) {
        return api.get(`/books/${id}`);
    },

    // Get available books
    getAvailable() {
        return api.get('/books/available');
    },

    // Create new book
    create(data) {
        return api.post('/books', data);
    },

    // Update book
    update(id, data) {
        return api.put(`/books/${id}`, data);
    },

    // Delete book
    delete(id) {
        return api.delete(`/books/${id}`);
    },

    // Delete all books
    deleteAll() {
        return api.delete('/books');
    },

    // Search books by title
    searchByTitle(title) {
        return api.get(`/books?title=${title}`);
    }
};