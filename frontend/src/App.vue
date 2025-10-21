<template>
  <div id="app">
    <!-- Navigation Bar (only show if authenticated) -->
    <nav
      v-if="isAuthenticated"
      class="navbar navbar-expand-lg navbar-dark bg-primary"
    >
      <div class="container">
        <router-link class="navbar-brand" to="/">
          <i class="fas fa-book"></i> Library Management
        </router-link>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/dashboard">
                <i class="fas fa-tachometer-alt"></i> Dashboard
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/books">
                <i class="fas fa-book"></i> Books
              </router-link>
            </li>
            <li v-if="isAdmin" class="nav-item">
              <router-link class="nav-link" to="/users">
                <i class="fas fa-users"></i> Users
              </router-link>
            </li>
            <li v-if="isAdmin" class="nav-item">
              <router-link class="nav-link" to="/librarians">
                <i class="fas fa-user-tie"></i> Librarians
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/borrowing">
                <i class="fas fa-handshake"></i> Borrowing
              </router-link>
            </li>
          </ul>

          <!-- User Info & Logout -->
          <ul class="navbar-nav">
            <!-- Simple Logout Button (Backup) -->
            <li class="nav-item me-2">
              <button
                class="btn btn-outline-light btn-sm"
                @click="handleLogout"
                title="Logout"
              >
                <i class="fas fa-sign-out-alt"></i>
              </button>
            </li>

            <!-- User Dropdown -->
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="fas fa-user"></i> {{ currentUser?.user_name }}
                <span v-if="isAdmin" class="badge bg-warning text-dark ms-1"
                  >Admin</span
                >
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <span class="dropdown-item-text"
                    ><strong>{{ currentUser?.user_name }}</strong></span
                  >
                </li>
                <li>
                  <span class="dropdown-item-text text-muted">{{
                    currentUser?.email || "No email"
                  }}</span>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <a
                    class="dropdown-item"
                    href="#"
                    @click.prevent="handleLogout"
                  >
                    <i class="fas fa-sign-out-alt"></i> Logout
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main :class="isAuthenticated ? 'container-fluid py-4' : ''">
      <router-view />
    </main>

    <!-- Notification Container -->
    <NotificationContainer />

    <!-- Footer (only show if authenticated) -->
    <footer v-if="isAuthenticated" class="bg-light py-3 mt-5">
      <div class="container text-center">
        <p class="text-muted mb-0">
          &copy; 2025 Library Management System. Built with Vue.js & Node.js
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import NotificationContainer from "./components/NotificationContainer.vue";
import authService from "./services/authService.js";
import { NotificationService } from "./services/notificationService.js";

export default {
  name: "App",
  components: {
    NotificationContainer,
  },
  data() {
    return {
      currentUser: null,
      isAuthenticated: false,
    };
  },
  computed: {
    isAdmin() {
      return this.currentUser && this.currentUser.role === "admin";
    },
  },
  methods: {
    updateAuthState() {
      this.isAuthenticated = authService.isAuthenticated();
      this.currentUser = authService.getCurrentUser();
    },
    handleLogout() {
      authService.logout();
      NotificationService.success("Logged out successfully");
      this.updateAuthState();
      this.$router.push("/login");
    },
  },
  created() {
    // Initialize auth service
    authService.initialize();
    this.updateAuthState();

    // Listen for route changes to update auth state
    this.$router.afterEach(() => {
      this.updateAuthState();
    });
  },
};
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.router-link-active {
  font-weight: bold;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>