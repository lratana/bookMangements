import api from './api.js';

export default {
    // Get all librarians
    getAll() {
        return api.get('/librarians');
    },

    // Get librarian by ID
    getById(id) {
        return api.get(`/librarians/${id}`);
    },

    // Create new librarian
    create(data) {
        return api.post('/librarians', data);
    },

    // Update librarian
    update(id, data) {
        return api.put(`/librarians/${id}`, data);
    },

    // Delete librarian
    delete(id) {
        return api.delete(`/librarians/${id}`);
    },

    // Delete all librarians
    deleteAll() {
        return api.delete('/librarians');
    }
};