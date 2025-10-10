<template>
  <div class="librarians">
    <div class="row mb-4">
      <div class="col-md-6">
        <h1 class="h2">
          <i class="fas fa-user-tie"></i> Librarians Management
        </h1>
      </div>
      <div class="col-md-6 text-end">
        <button class="btn btn-primary" @click="showAddForm = true">
          <i class="fas fa-plus"></i> Add New Librarian
        </button>
      </div>
    </div>

    <!-- Add/Edit Librarian Form -->
    <div v-if="showAddForm || editingLibrarian" class="card mb-4">
      <div class="card-header">
        <h5 class="mb-0">{{ editingLibrarian ? 'Edit Librarian' : 'Add New Librarian' }}</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="saveLibrarian">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="LibrarianName" class="form-label">Name *</label>
              <input
                type="text"
                class="form-control"
                id="LibrarianName"
                v-model="librarianForm.LibrarianName"
                required
              />
            </div>
            <div class="col-md-6 mb-3">
              <label for="Gender" class="form-label">Gender *</label>
              <select class="form-select" id="Gender" v-model="librarianForm.Gender" required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="Phone" class="form-label">Phone *</label>
              <input
                type="text"
                class="form-control"
                id="Phone"
                v-model="librarianForm.Phone"
                required
              />
            </div>
            <div class="col-md-6 mb-3">
              <label for="Address" class="form-label">Address *</label>
              <textarea
                class="form-control"
                id="Address"
                v-model="librarianForm.Address"
                rows="2"
                required
              ></textarea>
            </div>
          </div>
          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-success" :disabled="loading">
              <i class="fas fa-save"></i> {{ editingLibrarian ? 'Update' : 'Save' }}
            </button>
            <button type="button" class="btn btn-secondary" @click="cancelForm">
              <i class="fas fa-times"></i> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Librarians Table -->
    <div class="card">
      <div class="card-body">
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div v-else-if="librarians.length === 0" class="text-center py-4 text-muted">
          <i class="fas fa-user-tie fa-3x mb-3"></i>
          <p>No librarians found</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead class="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="librarian in librarians" :key="librarian.LibrarianID">
                <td>{{ librarian.LibrarianID }}</td>
                <td>
                  <strong>{{ librarian.LibrarianName }}</strong>
                </td>
                <td>
                  <span class="badge" :class="librarian.Gender === 'Male' ? 'bg-primary' : 'bg-info'">
                    {{ librarian.Gender }}
                  </span>
                </td>
                <td>{{ librarian.Phone }}</td>
                <td class="text-truncate" style="max-width: 200px;">{{ librarian.Address }}</td>
                <td>{{ formatDate(librarian.createdAt) }}</td>
                <td>
                  <div class="btn-group" role="group">
                    <button
                      class="btn btn-sm btn-outline-primary"
                      @click="editLibrarian(librarian)"
                      title="Edit"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      class="btn btn-sm btn-outline-danger"
                      @click="deleteLibrarian(librarian)"
                      title="Delete"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import librarianService from '../services/librarianService.js';

export default {
  name: 'Librarians',
  data() {
    return {
      librarians: [],
      loading: false,
      showAddForm: false,
      editingLibrarian: null,
      librarianForm: {
        LibrarianName: '',
        Gender: '',
        Phone: '',
        Address: ''
      }
    }
  },
  async mounted() {
    await this.loadLibrarians();
  },
  methods: {
    async loadLibrarians() {
      this.loading = true;
      try {
        const response = await librarianService.getAll();
        this.librarians = response.data;
      } catch (error) {
        console.error('Error loading librarians:', error);
        alert('Error loading librarians. Please try again.');
      } finally {
        this.loading = false;
      }
    },
    async saveLibrarian() {
      this.loading = true;
      try {
        if (this.editingLibrarian) {
          await librarianService.update(this.editingLibrarian.LibrarianID, this.librarianForm);
        } else {
          await librarianService.create(this.librarianForm);
        }
        
        await this.loadLibrarians();
        this.cancelForm();
        alert(this.editingLibrarian ? 'Librarian updated successfully!' : 'Librarian created successfully!');
      } catch (error) {
        console.error('Error saving librarian:', error);
        alert('Error saving librarian. Please try again.');
      } finally {
        this.loading = false;
      }
    },
    editLibrarian(librarian) {
      this.editingLibrarian = librarian;
      this.librarianForm = {
        LibrarianName: librarian.LibrarianName,
        Gender: librarian.Gender,
        Phone: librarian.Phone,
        Address: librarian.Address
      };
      this.showAddForm = false;
    },
    async deleteLibrarian(librarian) {
      if (confirm(`Are you sure you want to delete librarian "${librarian.LibrarianName}"?`)) {
        this.loading = true;
        try {
          await librarianService.delete(librarian.LibrarianID);
          await this.loadLibrarians();
          alert('Librarian deleted successfully!');
        } catch (error) {
          console.error('Error deleting librarian:', error);
          alert('Error deleting librarian. Please try again.');
        } finally {
          this.loading = false;
        }
      }
    },
    cancelForm() {
      this.showAddForm = false;
      this.editingLibrarian = null;
      this.librarianForm = {
        LibrarianName: '',
        Gender: '',
        Phone: '',
        Address: ''
      };
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString();
    }
  }
}
</script>