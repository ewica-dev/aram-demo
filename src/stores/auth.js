import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: JSON.parse(localStorage.getItem('aram_user') || 'null')
  }),
  actions: {
    authenticate(username, password, isSignUp) {
      let users = JSON.parse(localStorage.getItem('aram_users') || '[]')
      
      if (isSignUp) {
        const exists = users.find(u => u.username === username)
        if (exists) throw new Error('Username taken')
        users.push({ username, password })
        localStorage.setItem('aram_users', JSON.stringify(users))
      } else {
        const valid = users.find(u => u.username === username && u.password === password)
        if (!valid) throw new Error('Invalid credentials')
      }
      
      this.currentUser = username
      localStorage.setItem('aram_user', JSON.stringify(username))
    },
    logout() {
      this.currentUser = null
      localStorage.removeItem('aram_user')
    }
  }
})