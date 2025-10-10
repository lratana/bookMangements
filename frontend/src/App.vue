<template>
  <div id="app">
    <!-- Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <router-link class="navbar-brand" to="/">
          <i class="fas fa-book"></i> Library Management
        </router-link>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
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
            <li class="nav-item">
              <router-link class="nav-link" to="/users">
                <i class="fas fa-users"></i> Users
              </router-link>
            </li>
            <li class="nav-item">
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
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="container-fluid py-4">
      <router-view />
    </main>

    <!-- Notification Container -->
    <NotificationContainer />

    <!-- Footer -->
    <footer class="bg-light py-3 mt-5">
      <div class="container text-center">
        <p class="text-muted mb-0">
          &copy; 2025 Library Management System. Built with Vue.js & Node.js
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import NotificationContainer from './components/NotificationContainer.vue'

export default {
  name: 'App',
  components: {
    NotificationContainer
  }
}
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>