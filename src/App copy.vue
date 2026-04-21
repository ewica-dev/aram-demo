<script setup>
import { ref, onMounted } from 'vue'

// State management
const articles = ref([])
const loading = ref(true)
const error = ref(null)

// The API fetch function
const fetchTechNews = async () => {
  const apiKey = 'a7794e6925154a069a554f14e6f9852f' // Paste your key here
  const url = `https://newsapi.org/v2/top-headlines?category=technology&language=en&apiKey=${apiKey}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    // We only want articles that actually have a title and URL
    articles.value = data.articles.filter(article => article.title && article.url)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

// Fire the fetch when the component mounts to the screen
onMounted(() => {
  fetchTechNews()
})
</script>

<template>
  <div class="test-container">
    <h1>aram.</h1>
    <p class="subtitle">Live Tech News Connection Test</p>

    <div v-if="loading" class="status">Loading the latest tech news...</div>
    <div v-else-if="error" class="status error">Error: {{ error }}</div>
    
    <ul v-else class="feed">
      <li v-for="(article, index) in articles" :key="index" class="card">
        <h3>{{ article.title }}</h3>
        <p v-if="article.description">{{ article.description }}</p>
        <a :href="article.url" target="_blank">Read Original</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Ultra-basic styles just to make the test readable */
.test-container {
  max-width: 600px;
  margin: 0 auto;
  font-family: sans-serif;
  padding: 20px;
}
.subtitle {
  color: #666;
  margin-bottom: 2rem;
}
.status {
  font-weight: bold;
  color: #007bff;
}
.error {
  color: red;
}
.feed {
  list-style: none;
  padding: 0;
}
.card {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
}
.card h3 {
  margin-top: 0;
}
a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}
</style>