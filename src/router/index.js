/**
 * Vue Router configuration for aram app.
 * Handles routing and navigation guards for personalization flow.
 * @module router
 */
import { createRouter, createWebHistory } from 'vue-router'
import Feed from '../views/Feed.vue'
import Welcome from '../views/Welcome.vue'
import Vault from '../views/Vault.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Feed', component: Feed },
    { path: '/welcome', name: 'Welcome', component: Welcome },
    { path: '/vault', name: 'Vault', component: Vault }
  ]
})

router.beforeEach((to) => {
  const hasName = localStorage.getItem('aram_user_name')
  
  if (to.path === '/' && !hasName) {
    return '/welcome'
  }
  
  if (to.path === '/welcome' && hasName) {
    return '/' 
  }
})

export default router