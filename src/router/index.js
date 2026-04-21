import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Login from '../views/Login.vue'
import Feed from '../views/Feed.vue'

const router = createRouter({
  // This automatically uses the base path you set in vite.config.js
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Feed, meta: { requiresAuth: true } },
    { path: '/login', component: Login }
  ]
})

// Updated Vue Router 4 syntax (no more next() callback)
router.beforeEach((to) => {
  const auth = useAuthStore()
  
  if (to.meta.requiresAuth && !auth.currentUser) {
    // Redirect to login if they aren't authenticated
    return '/login'
  }
  // Otherwise, allow the navigation automatically
})

export default router