<template>
  <div class="books">
    <div class="row mb-4">
      <div class="col-md-6">
        <h1 class="h2">
          <i class="fas fa-book"></i> Books Management
        </h1>
      </div>
      <div class="col-md-6 text-end">
        <button class="btn btn-primary" @click="showAddForm = true">
          <i class="fas fa-plus"></i> Add New Book
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
            placeholder="Search books by title or author..."
            v-model="searchQuery"
            @input="filterBooks"
          />
        </div>
      </div>
      <div class="col-md-6">
        <select class="form-select" v-model="filterStatus" @change="filterBooks">
          <option value="">All Books</option>
          <option value="available">Available</option>
          <option value="borrowed">Borrowed</option>
        </select>
      </div>
    </div>

    <!-- Add/Edit Book Form -->
    <div v-if="showAddForm || editingBook" class="card mb-4">
      <div class="card-header">
        <h5 class="mb-0">{{ editingBook ? 'Edit Book' : 'Add New Book' }}</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="saveBook">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="title" class="form-label">Title *</label>
              <input
                type="text"
                class="form-control"
                id="title"
                v-model="bookForm.title"
                required
              />
            </div>
            <div class="col-md-6 mb-3">
              <label for="author" class="form-label">Author *</label>
              <input
                type="text"
                class="form-control"
                id="author"
                v-model="bookForm.author"
                required
              />
            </div>
          </div>
          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-success" :disabled="loading">
              <i class="fas fa-save"></i> {{ editingBook ? 'Update' : 'Save' }}
            </button>
            <button type="button" class="btn btn-secondary" @click="cancelForm">
              <i class="fas fa-times"></i> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Books Table -->
    <div class="card">
      <div class="card-body">
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div v-else-if="filteredBooks.length === 0" class="text-center py-4 text-muted">
          <i class="fas fa-book fa-3x mb-3"></i>
          <p>No books found</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead class="table-dark">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Borrowed By</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in paginatedBooks" :key="book.book_id">
                <td>{{ book.book_id }}</td>
                <td>
                  <strong>{{ book.title }}</strong>
                </td>
                <td>{{ book.author }}</td>
                <td>
                  <span v-if="book.borrowed" class="badge bg-warning">
                    <i class="fas fa-handshake"></i> Borrowed
                  </span>
                  <span v-else class="badge bg-success">
                    <i class="fas fa-check"></i> Available
                  </span>
                </td>
                <td>
                  <span v-if="book.user_id" class="text-muted">
                    User ID: {{ book.user_id }}
                  </span>
                  <span v-else class="text-muted">-</span>
                </td>
                <td>{{ formatDate(book.createdAt) }}</td>
                <td>
                  <div class="btn-group" role="group">
                    <button
                      class="btn btn-sm btn-outline-primary"
                      @click="editBook(book)"
                      title="Edit"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      class="btn btn-sm btn-outline-danger"
                      @click="deleteBook(book)"
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
import bookService from '../services/bookService.js';

export default {
  name: 'Books',
  data() {
    return {
      books: [],
      filteredBooks: [],
      loading: false,
      showAddForm: false,
      editingBook: null,
      searchQuery: '',
      filterStatus: '',
      currentPage: 1,
      itemsPerPage: 10,
      bookForm: {
        title: '',
        author: ''
      }
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredBooks.length / this.itemsPerPage);
    },
    paginatedBooks() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredBooks.slice(start, end);
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
    await this.loadBooks();
  },
  methods: {
    async loadBooks() {
      this.loading = true;
      try {
        const response = await bookService.getAll();
        this.books = response.data;
        this.filteredBooks = [...this.books];
      } catch (error) {
        console.error('Error loading books:', error);
        alert('Error loading books. Please try again.');
      } finally {
        this.loading = false;
      }
    },
    filterBooks() {
      let filtered = [...this.books];

      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(book =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
        );
      }

      // Status filter
      if (this.filterStatus === 'available') {
        filtered = filtered.filter(book => !book.borrowed);
      } else if (this.filterStatus === 'borrowed') {
        filtered = filtered.filter(book => book.borrowed);
      }

      this.filteredBooks = filtered;
      this.currentPage = 1;
    },
    async saveBook() {
      this.loading = true;
      try {
        if (this.editingBook) {
          await bookService.update(this.editingBook.book_id, this.bookForm);
        } else {
          await bookService.create(this.bookForm);
        }
        
        await this.loadBooks();
        this.cancelForm();
        alert(this.editingBook ? 'Book updated successfully!' : 'Book created successfully!');
      } catch (error) {
        console.error('Error saving book:', error);
        alert('Error saving book. Please try again.');
      } finally {
        this.loading = false;
      }
    },
    editBook(book) {
      this.editingBook = book;
      this.bookForm = {
        title: book.title,
        author: book.author
      };
      this.showAddForm = false;
    },
    async deleteBook(book) {
      if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
        this.loading = true;
        try {
          await bookService.delete(book.book_id);
          await this.loadBooks();
          alert('Book deleted successfully!');
        } catch (error) {
          console.error('Error deleting book:', error);
          alert('Error deleting book. Please try again.');
        } finally {
          this.loading = false;
        }
      }
    },
    cancelForm() {
      this.showAddForm = false;
      this.editingBook = null;
      this.bookForm = {
        title: '',
        author: ''
      };
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString();
    }
  }
}
</script>

<style scoped>
.table th {
  border-top: none;
}

.btn-group .btn {
  margin: 0;
}

.pagination .page-link {
  cursor: pointer;
}
</style>