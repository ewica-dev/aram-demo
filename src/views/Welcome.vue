<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')

const enterApp = () => {
  // Make sure they didn't just type spaces
  if (name.value.trim()) {
    // Save to local storage and route to the feed
    localStorage.setItem('aram_user_name', name.value.trim())
    router.push('/')
  }
}
</script>

<template>
  <div class="welcome-container">
    <h1 class="logo">aram.</h1>
    <p class="subtitle">Tech doomscrolling, personalized.</p>

    <form @submit.prevent="enterApp" class="name-form">
      <input 
        v-model="name" 
        type="text" 
        placeholder="What is your first name?" 
        required 
        autofocus
      />
      <button type="submit">Enter</button>
    </form>
  </div>
</template>

<style scoped>
.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100dvh;
  padding: 20px;
  background: #000;
}
.logo { font-size: 3.5rem; margin: 0; font-weight: 900; letter-spacing: -2px; }
.subtitle { color: #888; margin-bottom: 40px; font-size: 1.1rem; }
.name-form { display: flex; flex-direction: column; width: 100%; max-width: 320px; gap: 15px; }

input {
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #333;
  background: #111;
  color: white;
  font-size: 1.1rem;
  text-align: center;
  outline: none;
  transition: border-color 0.2s;
}
input:focus { border-color: #666; }

button[type="submit"] {
  padding: 16px;
  border-radius: 12px;
  border: none;
  background: #fff;
  color: #000;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.1s;
}
button[type="submit"]:active { transform: scale(0.98); }
</style>