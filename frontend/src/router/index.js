import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Books from '../views/Books.vue';
import Users from '../views/Users.vue';
import Librarians from '../views/Librarians.vue';
import Borrowing from '../views/Borrowing.vue';

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/books',
    name: 'Books',
    component: Books
  },
  {
    path: '/users',
    name: 'Users',
    component: Users
  },
  {
    path: '/librarians',
    name: 'Librarians',
    component: Librarians
  },
  {
    path: '/borrowing',
    name: 'Borrowing',
    component: Borrowing
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;