import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // Blank layout routes (no header/drawer)
  {
    path: '/',
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      { path: '', redirect: '/login' },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'home', component: () => import('pages/HomePage.vue') },
      { path: 'chat', component: () => import('pages/ChatPage.vue') },
      { path:'test', component: () => import('pages/TestPage.vue')}
    ],
  },

  // Main layout (original)
  {
    path: '/app',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
