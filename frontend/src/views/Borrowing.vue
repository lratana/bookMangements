<template>
  <div class="borrowing">
    <div class="row mb-4">
      <div class="col-md-6">
        <h1 class="h2">
          <i class="fas fa-handshake"></i> Borrowing Management
        </h1>
      </div>
      <div class="col-md-6 text-end">
        <button class="btn btn-primary" @click="showBorrowForm = true">
          <i class="fas fa-plus"></i> New Borrowing
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card bg-warning text-white">
          <div class="card-body text-center">
            <i class="fas fa-handshake fa-2x mb-2"></i>
            <h4>{{ currentlyBorrowedCount }}</h4>
            <p class="mb-0">Currently Borrowed</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card bg-success text-white">
          <div class="card-body text-center">
            <i class="fas fa-undo fa-2x mb-2"></i>
            <h4>{{ returnedCount }}</h4>
            <p class="mb-0">Returned Books</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card bg-info text-white">
          <div class="card-body text-center">
            <i class="fas fa-chart-bar fa-2x mb-2"></i>
            <h4>{{ totalBorrowings }}</h4>
            <p class="mb-0">Total Borrowings</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Borrow Book Form -->
    <div v-if="showBorrowForm" class="card mb-4">
      <div class="card-header">
        <h5 class="mb-0">New Book Borrowing</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="borrowBook">
          <div class="row">
            <div class="col-md-4 mb-3">
              <label for="UserID" class="form-label">User *</label>
              <select class="form-select" id="UserID" v-model="borrowForm.UserID" required>
                <option value="">Select User</option>
                <option v-for="user in users" :key="user.user_id" :value="user.user_id">
                  {{ user.user_name }}
                </option>
              </select>
            </div>
            <div class="col-md-4 mb-3">
              <label for="LibrarianID" class="form-label">Librarian *</label>
              <select class="form-select" id="LibrarianID" v-model="borrowForm.LibrarianID" required>
                <option value="">Select Librarian</option>
                <option v-for="librarian in librarians" :key="librarian.LibrarianID" :value="librarian.LibrarianID">
                  {{ librarian.LibrarianName }}
                </option>
              </select>
            </div>
            <div class="col-md-4 mb-3">
              <label for="BookId" class="form-label">Book *</label>
              <select class="form-select" id="BookId" v-model="borrowForm.BookId" required>
                <option value="">Select Book</option>
                <option v-for="book in availableBooks" :key="book.book_id" :value="book.book_id">
                  {{ book.title }} - {{ book.author }}
                </option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="BorrowBookDate" class="form-label">Borrow Date *</label>
              <input
                type="date"
                class="form-control"
                id="BorrowBookDate"
                v-model="borrowForm.BorrowBookDate"
                required
              />
            </div>
          </div>
          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-success" :disabled="loading">
              <i class="fas fa-handshake"></i> Borrow Book
            </button>
            <button type="button" class="btn btn-secondary" @click="cancelBorrowForm">
              <i class="fas fa-times"></i> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="card">
      <div class="card-header">
        <ul class="nav nav-tabs card-header-tabs">
          <li class="nav-item">
            <button 
              class="nav-link" 
              :class="{ active: activeTab === 'all' }"
              @click="activeTab = 'all'"
            >
              All Borrowings
            </button>
          </li>
          <li class="nav-item">
            <button 
              class="nav-link" 
              :class="{ active: activeTab === 'borrowed' }"
              @click="activeTab = 'borrowed'"
            >
              Currently Borrowed
            </button>
          </li>
          <li class="nav-item">
            <button 
              class="nav-link" 
              :class="{ active: activeTab === 'returned' }"
              @click="activeTab = 'returned'"
            >
              Returned
            </button>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div v-else-if="filteredBorrowings.length === 0" class="text-center py-4 text-muted">
          <i class="fas fa-handshake fa-3x mb-3"></i>
          <p>No borrowings found</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead class="table-dark">
              <tr>
                <th>ID</th>
                <th>Book</th>
                <th>User</th>
                <th>Librarian</th>
                <th>Borrow Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="borrow in filteredBorrowings" :key="borrow.BorrowID">
                <td>{{ borrow.BorrowID }}</td>
                <td>
                  <strong>{{ borrow.books?.title || 'N/A' }}</strong>
                  <br>
                  <small class="text-muted">by {{ borrow.books?.author || 'N/A' }}</small>
                </td>
                <td>{{ borrow.Users?.user_name || 'N/A' }}</td>
                <td>{{ borrow.librarians?.LibrarianName || 'N/A' }}</td>
                <td>{{ formatDate(borrow.BorrowBookDate) }}</td>
                <td>{{ formatDate(borrow.ReturnBookDate) }}</td>
                <td>
                  <span v-if="borrow.IsBorrow" class="badge bg-warning">
                    <i class="fas fa-handshake"></i> Borrowed
                  </span>
                  <span v-else class="badge bg-success">
                    <i class="fas fa-undo"></i> Returned
                  </span>
                </td>
                <td>
                  <button
                    v-if="borrow.IsBorrow"
                    class="btn btn-sm btn-outline-success"
                    @click="returnBook(borrow)"
                    title="Return Book"
                  >
                    <i class="fas fa-undo"></i> Return
                  </button>
                  <span v-else class="text-muted">-</span>
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
import borrowService from '../services/borrowService.js';
import bookService from '../services/bookService.js';
import userService from '../services/userService.js';
import librarianService from '../services/librarianService.js';
import { NotificationService } from '../services/notificationService.js';

export default {
  name: 'Borrowing',
  data() {
    return {
      borrowings: [],
      users: [],
      librarians: [],
      availableBooks: [],
      loading: false,
      showBorrowForm: false,
      activeTab: 'all',
      borrowForm: {
        UserID: '',
        LibrarianID: '',
        BookId: '',
        BorrowBookDate: new Date().toISOString().split('T')[0]
      }
    }
  },
  computed: {
    filteredBorrowings() {
      switch (this.activeTab) {
        case 'borrowed':
          return this.borrowings.filter(b => b.IsBorrow);
        case 'returned':
          return this.borrowings.filter(b => !b.IsBorrow);
        default:
          return this.borrowings;
      }
    },
    totalBorrowings() {
      return this.borrowings.length;
    },
    currentlyBorrowedCount() {
      return this.borrowings.filter(b => b.IsBorrow).length;
    },
    returnedCount() {
      return this.borrowings.filter(b => !b.IsBorrow).length;
    }
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const [borrowsRes, usersRes, librariansRes, booksRes] = await Promise.all([
          borrowService.getAll(),
          userService.getAll(),
          librarianService.getAll(),
          bookService.getAvailable()
        ]);

        this.borrowings = borrowsRes.data;
        this.users = usersRes.data;
        this.librarians = librariansRes.data;
        this.availableBooks = booksRes.data;
      } catch (error) {
        console.error('Error loading data:', error);
        NotificationService.error('Error loading data. Please try again.');
      } finally {
        this.loading = false;
      }
    },
    async borrowBook() {
      this.loading = true;
      try {
        await borrowService.borrowBook(this.borrowForm);
        await this.loadData();
        this.cancelBorrowForm();
        NotificationService.success('Book borrowed successfully!');
      } catch (error) {
        console.error('Error borrowing book:', error);
        NotificationService.error('Error borrowing book. Please try again.');
      } finally {
        this.loading = false;
      }
    },
    async returnBook(borrow) {
      if (confirm(`Are you sure you want to return "${borrow.books?.title}"?`)) {
        this.loading = true;
        try {
          await borrowService.returnBook(borrow.BorrowID);
          await this.loadData();
          NotificationService.success('Book returned successfully!');
        } catch (error) {
          console.error('Error returning book:', error);
          NotificationService.error('Error returning book. Please try again.');
        } finally {
          this.loading = false;
        }
      }
    },
    cancelBorrowForm() {
      this.showBorrowForm = false;
      this.borrowForm = {
        UserID: '',
        LibrarianID: '',
        BookId: '',
        BorrowBookDate: new Date().toISOString().split('T')[0]
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
.nav-tabs .nav-link {
  cursor: pointer;
}
</style>