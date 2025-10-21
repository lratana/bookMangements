import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Books from '../views/Books.vue';
import Users from '../views/Users.vue';
import Librarians from '../views/Librarians.vue';
import Borrowing from '../views/Borrowing.vue';
import Login from '../views/Login.vue';
import authService from '../services/authService.js';

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { requiresAuth: false }
    },
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/books',
        name: 'Books',
        component: Books,
        meta: { requiresAuth: true }
    },
    {
        path: '/users',
        name: 'Users',
        component: Users,
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/librarians',
        name: 'Librarians',
        component: Librarians,
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/borrowing',
        name: 'Borrowing',
        component: Borrowing,
        meta: { requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Navigation guards
router.beforeEach((to, from, next) => {
    const isAuthenticated = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    // Initialize auth service
    authService.initialize();

    // If route requires authentication
    if (to.meta.requiresAuth !== false && !isAuthenticated) {
        // Redirect to login if not authenticated
        next('/login');
        return;
    }

    // If user is authenticated and trying to access login page
    if (to.path === '/login' && isAuthenticated) {
        // Redirect to dashboard
        next('/dashboard');
        return;
    }

    // Check admin-only routes
    if (to.meta.requiresAdmin && (!currentUser || currentUser.role !== 'admin')) {
        // Redirect to dashboard if not admin
        next('/dashboard');
        return;
    }

    next();
});

export default router;