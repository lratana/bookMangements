<template>
  <div class="dashboard">
    <div class="row mb-4">
      <div class="col-12">
        <h1 class="h2">
          <i class="fas fa-tachometer-alt"></i> Dashboard
        </h1>
        <p class="text-muted">Welcome to the Library Management System</p>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="row mb-4">
      <div class="col-md-3 col-sm-6 mb-3">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h3 class="card-title">{{ statistics.totalBooks }}</h3>
                <p class="card-text">Total Books</p>
              </div>
              <div class="align-self-center">
                <i class="fas fa-book fa-2x"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3 col-sm-6 mb-3">
        <div class="card bg-success text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h3 class="card-title">{{ statistics.totalUsers }}</h3>
                <p class="card-text">Total Users</p>
              </div>
              <div class="align-self-center">
                <i class="fas fa-users fa-2x"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3 col-sm-6 mb-3">
        <div class="card bg-warning text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h3 class="card-title">{{ statistics.currentlyBorrowed }}</h3>
                <p class="card-text">Currently Borrowed</p>
              </div>
              <div class="align-self-center">
                <i class="fas fa-handshake fa-2x"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3 col-sm-6 mb-3">
        <div class="card bg-info text-white">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <h3 class="card-title">{{ statistics.totalLibrarians }}</h3>
                <p class="card-text">Total Librarians</p>
              </div>
              <div class="align-self-center">
                <i class="fas fa-user-tie fa-2x"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-clock"></i> Recent Borrowings
            </h5>
          </div>
          <div class="card-body">
            <div v-if="recentBorrowings.length === 0" class="text-center text-muted">
              No recent borrowings
            </div>
            <div v-else>
              <div v-for="borrow in recentBorrowings" :key="borrow.BorrowID" class="border-bottom py-2">
                <div class="d-flex justify-content-between">
                  <div>
                    <strong>{{ borrow.books?.title }}</strong>
                    <br>
                    <small class="text-muted">by {{ borrow.Users?.user_name }}</small>
                  </div>
                  <div class="text-end">
                    <small class="text-muted">{{ formatDate(borrow.BorrowBookDate) }}</small>
                    <br>
                    <span v-if="borrow.IsBorrow" class="badge bg-warning">Borrowed</span>
                    <span v-else class="badge bg-success">Returned</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-book"></i> Available Books
            </h5>
          </div>
          <div class="card-body">
            <div v-if="availableBooks.length === 0" class="text-center text-muted">
              No available books
            </div>
            <div v-else>
              <div v-for="book in availableBooks.slice(0, 5)" :key="book.book_id" class="border-bottom py-2">
                <div class="d-flex justify-content-between">
                  <div>
                    <strong>{{ book.title }}</strong>
                    <br>
                    <small class="text-muted">by {{ book.author }}</small>
                  </div>
                  <div class="text-end">
                    <span class="badge bg-success">Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bookService from '../services/bookService.js';
import userService from '../services/userService.js';
import librarianService from '../services/librarianService.js';
import borrowService from '../services/borrowService.js';

export default {
  name: 'Dashboard',
  data() {
    return {
      statistics: {
        totalBooks: 0,
        totalUsers: 0,
        totalLibrarians: 0,
        currentlyBorrowed: 0
      },
      recentBorrowings: [],
      availableBooks: []
    }
  },
  async mounted() {
    await this.loadStatistics();
    await this.loadRecentBorrowings();
    await this.loadAvailableBooks();
  },
  methods: {
    async loadStatistics() {
      try {
        const [booksRes, usersRes, librariansRes, borrowsRes] = await Promise.all([
          bookService.getAll(),
          userService.getAll(),
          librarianService.getAll(),
          borrowService.getCurrentlyBorrowed()
        ]);

        this.statistics.totalBooks = booksRes.data.length;
        this.statistics.totalUsers = usersRes.data.length;
        this.statistics.totalLibrarians = librariansRes.data.length;
        this.statistics.currentlyBorrowed = borrowsRes.data.length;
      } catch (error) {
        console.error('Error loading statistics:', error);
      }
    },
    async loadRecentBorrowings() {
      try {
        const response = await borrowService.getAll();
        this.recentBorrowings = response.data.slice(0, 5);
      } catch (error) {
        console.error('Error loading recent borrowings:', error);
      }
    },
    async loadAvailableBooks() {
      try {
        const response = await bookService.getAvailable();
        this.availableBooks = response.data;
      } catch (error) {
        console.error('Error loading available books:', error);
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString();
    }
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.card-title {
  font-size: 2rem;
  font-weight: bold;
}
</style>