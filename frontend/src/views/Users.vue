<template>
  <div class="users">
    <div class="row mb-4">
      <div class="col-md-6">
        <h1 class="h2">
          <i class="fas fa-users"></i> Users Management
        </h1>
      </div>
      <div class="col-md-6 text-end">
        <button class="btn btn-primary" @click="showAddForm = true">
          <i class="fas fa-plus"></i> Add New User
        </button>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="row mb-3">
      <div class="col-md-6">
        <div class="input-group">
          <span class="input-group-text">
            <i class="fas fa-search"></i>
          </span>
          <input
            type="text"
            class="form-control"
            placeholder="Search users by username..."
            v-model="searchQuery"
            @input="filterUsers"
          />
        </div>
      </div>
    </div>

    <!-- Add/Edit User Form -->
    <div v-if="showAddForm || editingUser" class="card mb-4">
      <div class="card-header">
        <h5 class="mb-0">{{ editingUser ? 'Edit User' : 'Add New User' }}</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="saveUser">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="user_name" class="form-label">Username *</label>
              <input
                type="text"
                class="form-control"
                id="user_name"
                v-model="userForm.user_name"
                required
              />
            </div>
          </div>
          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-success" :disabled="loading">
              <i class="fas fa-save"></i> {{ editingUser ? 'Update' : 'Save' }}
            </button>
            <button type="button" class="btn btn-secondary" @click="cancelForm">
              <i class="fas fa-times"></i> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Users Table -->
    <div class="card">
      <div class="card-body">
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div v-else-if="filteredUsers.length === 0" class="text-center py-4 text-muted">
          <i class="fas fa-users fa-3x mb-3"></i>
          <p>No users found</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead class="table-dark">
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in paginatedUsers" :key="user.user_id">
                <td>{{ user.user_id }}</td>
                <td>
                  <strong>{{ user.user_name }}</strong>
                </td>
                <td>{{ formatDate(user.createdAt) }}</td>
                <td>{{ formatDate(user.updatedAt) }}</td>
                <td>
                  <div class="btn-group" role="group">
                    <button
                      class="btn btn-sm btn-outline-primary"
                      @click="editUser(user)"
                      title="Edit"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      class="btn btn-sm btn-outline-danger"
                      @click="deleteUser(user)"
                      title="Delete"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <nav v-if="totalPages > 1">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="currentPage = 1" :disabled="currentPage === 1">
                  First
                </button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">
                  Previous
                </button>
              </li>
              <li
                v-for="page in visiblePages"
                :key="page"
                class="page-item"
                :class="{ active: page === currentPage }"
              >
                <button class="page-link" @click="currentPage = page">{{ page }}</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="currentPage++" :disabled="currentPage === totalPages">
                  Next
                </button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="currentPage = totalPages" :disabled="currentPage === totalPages">
                  Last
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userService from '../services/userService.js';

export default {
  name: 'Users',
  data() {
    return {
      users: [],
      filteredUsers: [],
      loading: false,
      showAddForm: false,
      editingUser: null,
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10,
      userForm: {
        user_name: ''
      }
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredUsers.slice(start, end);
    },
    visiblePages() {
      const pages = [];
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPages, this.currentPage + 2);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    }
  },
  async mounted() {
    await this.loadUsers();
  },
  methods: {
    async loadUsers() {
      this.loading = true;
      try {
        const response = await userService.getAll();
        this.users = response.data;
        this.filteredUsers = [...this.users];
      } catch (error) {
        console.error('Error loading users:', error);
        alert('Error loading users. Please try again.');
      } finally {
        this.loading = false;
      }
    },
    filterUsers() {
      let filtered = [...this.users];

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(user =>
          user.user_name.toLowerCase().includes(query)
        );
      }

      this.filteredUsers = filtered;
      this.currentPage = 1;
    },
    async saveUser() {
      this.loading = true;
      try {
        if (this.editingUser) {
          await userService.update(this.editingUser.user_id, this.userForm);
        } else {
          await userService.create(this.userForm);
        }
        
        await this.loadUsers();
        this.cancelForm();
        alert(this.editingUser ? 'User updated successfully!' : 'User created successfully!');
      } catch (error) {
        console.error('Error saving user:', error);
        alert('Error saving user. Please try again.');
      } finally {
        this.loading = false;
      }
    },
    editUser(user) {
      this.editingUser = user;
      this.userForm = {
        user_name: user.user_name
      };
      this.showAddForm = false;
    },
    async deleteUser(user) {
      if (confirm(`Are you sure you want to delete user "${user.user_name}"?`)) {
        this.loading = true;
        try {
          await userService.delete(user.user_id);
          await this.loadUsers();
          alert('User deleted successfully!');
        } catch (error) {
          console.error('Error deleting user:', error);
          alert('Error deleting user. Please try again.');
        } finally {
          this.loading = false;
        }
      }
    },
    cancelForm() {
      this.showAddForm = false;
      this.editingUser = null;
      this.userForm = {
        user_name: ''
      };
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString();
    }
  }
}
</script>