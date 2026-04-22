<script setup>
import { ref, onMounted } from 'vue'
import ArticleCard from '../components/ArticleCard.vue'

const savedArticles = ref([])

const loadVault = () => {
  const data = localStorage.getItem('aram_vault')
  savedArticles.value = data ? JSON.parse(data) : []
}

onMounted(() => {
  loadVault()
})
</script>

<template>
  <div class="vault-wrapper">
    <div class="vault-header">
      <router-link to="/" class="back-btn">← Back to Feed</router-link>
      <h1>Bookmarks</h1>
    </div>

    <div v-if="savedArticles.length === 0" class="empty-state">
      <p>Your bookmarks is empty.</p>
      <span>Save articles in the feed to see them here.</span>
    </div>

    <div v-else class="vault-feed">
      <ArticleCard 
        v-for="article in savedArticles" 
        :key="article.id" 
        :article="article" 
      />
    </div>
  </div>
</template>

<style scoped>
.vault-wrapper {
  height: 100dvh;
  background: #000;
}
.vault-header {
  position: fixed;
  top: 0;
  width: 100%;
  padding: 40px 20px 20px;
  z-index: 100;
  background: rgba(0,0,0,0.9);
  backdrop-filter: blur(10px);
}
.back-btn {
  color: #ff6600;
  text-decoration: none;
  font-family: monospace;
  font-weight: bold;
  display: block;
  margin-bottom: 10px;
}
h1 { margin: 0; font-size: 1.5rem; }

.empty-state {
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #555;
  text-align: center;
  padding: 20px;
}
.empty-state p { font-size: 1.2rem; color: #888; margin-bottom: 8px; }

.vault-feed {
  height: 100dvh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
}
.vault-feed::-webkit-scrollbar { display: none; }
</style>