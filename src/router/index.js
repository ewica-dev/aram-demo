import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Login from '../views/Login.vue'
import Feed from '../views/Feed.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Feed, meta: { requiresAuth: true } },
    { path: '/login', component: Login }
  ]
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.currentUser) next('/login')
  else next()
})

export default router