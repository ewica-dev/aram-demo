import { createRouter, createWebHistory } from 'vue-router'
import Feed from '../views/Feed.vue'
import Welcome from '../views/Welcome.vue'
import Vault from '../views/Vault.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Feed', component: Feed },
    { path: '/welcome', name: 'Welcome', component: Welcome },
    { path: '/vault', name: 'Vault', component: Vault } // Add the route
  ]
})

// The Personalization Guard
router.beforeEach((to) => {
  const hasName = localStorage.getItem('aram_user_name')
  
  // If trying to access the feed without a name, send to welcome
  if (to.path === '/' && !hasName) {
    return '/welcome'
  }
  
  // If trying to access the welcome screen but already named, send to feed
  if (to.path === '/welcome' && hasName) {
    return '/' 
  }
})

export default router