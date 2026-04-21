<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const isSignUp = ref(false)
const errorMsg = ref('')

const handleSubmit = () => {
  try {
    errorMsg.value = ''
    auth.authenticate(username.value, password.value, isSignUp.value)
    router.push('/')
  } catch (err) {
    errorMsg.value = err.message
  }
}
</script>

<template>
  <div class="auth-container">
    <h1 class="logo">aram.</h1>
    <p class="subtitle">Productive Doomscrolling.</p>

    <form @submit.prevent="handleSubmit" class="auth-form">
      <input v-model="username" type="text" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
      
      <button type="submit">{{ isSignUp ? 'Create Account' : 'Log In' }}</button>
    </form>

    <button class="toggle-btn" @click="isSignUp = !isSignUp">
      {{ isSignUp ? 'Already have an account? Log in.' : 'Need an account? Sign up.' }}
    </button>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100dvh;
  padding: 20px;
}
.logo { font-size: 3rem; margin: 0; font-weight: 800; letter-spacing: -2px; }
.subtitle { color: #888; margin-bottom: 40px; }
.auth-form { display: flex; flex-direction: column; width: 100%; max-width: 320px; gap: 15px; }
input { padding: 15px; border-radius: 8px; border: none; background: #222; color: white; font-size: 1rem; }
button[type="submit"] { padding: 15px; border-radius: 8px; border: none; background: #fff; color: #000; font-weight: bold; font-size: 1rem; cursor: pointer; }
.toggle-btn { background: none; border: none; color: #888; margin-top: 20px; cursor: pointer; }
.error { color: #ff4444; font-size: 0.9rem; text-align: center; margin: 0; }
</style>