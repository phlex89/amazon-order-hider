import { createRouter, createWebHistory } from 'vue-router';
import Main from '@/pages/Main.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: Main,
    },
  ],
});

export default router;
