import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginUI.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/client/dashboard',
    name: 'ClientDashboard',
    component: () => import('@/views/ClientDashboard.vue'),
    meta: { requiresAuth: true, role: 'client' }
  },
  {
    path: '/lawyer/dashboard',
    name: 'LawyerDashboard',
    component: () => import('@/views/LawyerDashboard.vue'),
    meta: { requiresAuth: true, role: 'lawyer' }
  },

  {
  path: '/admin/dashboard',
  name: 'AdminDashboard',
  component: () => import('@/views/AdminDashboard.vue'),
  meta: { requiresAuth: true, role: 'admin' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Simplified navigation guard (will be properly set up after Pinia is ready)
router.beforeEach((to, from, next) => {
  // Allow access to login and register without auth
  if (to.path === '/login' || to.path === '/register') {
    next()
    return
  }
  
  // For now, allow all routes (we'll add auth later)
  next()
})

export default router