<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const showManifesto = ref(false)

const enterApp = () => {
  if (name.value.trim()) {
    localStorage.setItem('aram_user_name', name.value.trim())
    router.push('/')
  }
}
</script>

<template>
  <div class="welcome-container">
    <div class="main-ui" :class="{ 'blurred': showManifesto }">
      <h1 class="logo">aram.</h1>
      <p class="subtitle">Doomscroll, but it counts.</p>

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

      <button @click="showManifesto = true" class="manifesto-trigger">
        What is this?
      </button>
    </div>

    <Transition name="fade">
      <div v-if="showManifesto" class="manifesto-overlay" @click="showManifesto = false">
        <div class="manifesto-content" @click.stop>
          <div class="meaning-tag">aram [Filipino]: to know.</div>
          
          <h2>The Philosophy</h2>
          
          <p>I built this because I’m tired of doomscrolling nonsense, but often too exhausted for "real" work. I’m self-aware enough to know I’m wasting time, but too lazy to hunt for heavy reading materials.</p>
          
          <p><strong>aram.</strong> fixes this. It’s for the horizontal developer. Stay rested, but keep learning.</p>
          
          <p>High-signal tech. No noise. No creators. Just knowledge for your thumbs.</p>
          
          <button @click="showManifesto = false" class="close-btn">Got it</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* --- Layout --- */
.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100dvh; /* Dynamic viewport height for mobile browsers */
  padding: 20px;
  background: #000;
  position: relative;
  overflow: hidden;
}

.main-ui {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: filter 0.4s ease, opacity 0.4s ease;
  width: 100%;
}

.main-ui.blurred {
  filter: blur(20px);
  opacity: 0.3;
  pointer-events: none;
}

/* --- Typography --- */
.logo { font-size: 3.5rem; margin: 0; font-weight: 900; letter-spacing: -2px; }
.subtitle { color: #888; margin-bottom: 40px; font-size: 1.1rem; }

/* --- Form Elements --- */
.name-form { display: flex; flex-direction: column; width: 100%; max-width: 320px; gap: 15px; }

input {
  padding: 18px;
  border-radius: 16px;
  border: 1px solid #222;
  background: #111;
  color: white;
  font-size: 1.1rem;
  text-align: center;
  outline: none;
  transition: border-color 0.2s;
  -webkit-appearance: none; /* Fix for iOS input styles */
}
input:focus { border-color: #444; }

button[type="submit"] {
  padding: 18px;
  border-radius: 16px;
  border: none;
  background: #fff;
  color: #000;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.1s;
}

.manifesto-trigger {
  margin-top: 40px;
  background: none;
  border: none;
  color: #444;
  font-size: 0.85rem;
  text-decoration: underline;
  cursor: pointer;
  letter-spacing: 0.5px;
}

/* --- Manifesto / Modal Styles --- */
.manifesto-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px); /* Modern PWA frosted glass effect */
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  z-index: 100;
}

.manifesto-content {
  max-width: 400px;
  width: 100%;
  color: #fff;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.meaning-tag {
  font-family: monospace;
  color: #00f5d4; 
  font-size: 0.75rem;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(0, 245, 212, 0.3);
}

h2 { 
  font-size: 1.8rem; 
  margin: 0 0 20px 0; 
  font-weight: 800;
  letter-spacing: -1px; 
}

p {
  font-size: 1rem;
  line-height: 1.5;
  color: #bbb;
  margin-bottom: 15px;
  max-width: 340px;
}

.close-btn {
  margin-top: 25px;
  background: #fff;
  color: #000;
  border: none;
  padding: 14px 40px;
  border-radius: 30px;
  font-weight: bold;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(0,0,0,0.4);
}

/* --- Transitions --- */
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Desktop optimization */
@media (min-width: 768px) {
  .logo { font-size: 4.5rem; }
  p { font-size: 1.1rem; }
}
</style>