import api from './api.js';

export default {
    // Get all users
    getAll() {
        return api.get('/users');
    },

    // Get user by ID
    getById(id) {
        return api.get(`/users/${id}`);
    },

    // Get user by username
    getByUsername(username) {
        return api.get(`/users/username/${username}`);
    },

    // Create new user
    create(data) {
        return api.post('/users', data);
    },

    // Update user
    update(id, data) {
        return api.put(`/users/${id}`, data);
    },

    // Delete user
    delete(id) {
        return api.delete(`/users/${id}`);
    },

    // Delete all users
    deleteAll() {
        return api.delete('/users');
    }
};