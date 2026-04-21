<script setup>
import { ref, onMounted } from 'vue'
import ArticleCard from '../components/ArticleCard.vue'

const articles = ref([])
const loading = ref(true)
const feedContainer = ref(null)
const startY = ref(0)
const isRefreshing = ref(false)

const fetchNews = async () => {
  loading.value = true
  
  try {
    // 1. Fetch from Hacker News instead of NewsAPI
    const topStoriesRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
    const storyIds = await topStoriesRes.json()

    // 2. Grab the top 20 story IDs
    const firstBatchIds = storyIds.slice(0, 20)

    // 3. Fetch the details for each of those 20 stories
    const itemPromises = firstBatchIds.map(id => 
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
    )

    const items = await Promise.all(itemPromises)

    // 4. Filter out any empty items or items without a URL
    articles.value = items.filter(item => item !== null && item.url)
  } catch (error) {
    console.error("Failed to fetch HN data:", error)
  } finally {
    loading.value = false
    isRefreshing.value = false
  }
}

const onTouchStart = (e) => {
  if (feedContainer.value && feedContainer.value.scrollTop === 0) {
    startY.value = e.touches[0].clientY
  }
}

const onTouchMove = (e) => {
  if (feedContainer.value && feedContainer.value.scrollTop === 0 && startY.value > 0) {
    const currentY = e.touches[0].clientY
    if (currentY - startY.value > 80 && !isRefreshing.value) {
      isRefreshing.value = true
      fetchNews()
      startY.value = 0
    }
  }
}

const onTouchEnd = () => { startY.value = 0 }

onMounted(() => { fetchNews() })
</script>

<template>
  <div 
    class="feed-wrapper" 
    ref="feedContainer"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div v-if="isRefreshing" class="refresh-indicator">Fetching latest updates...</div>
    <div v-if="loading && !isRefreshing" class="loading-screen">Loading aram...</div>
    
    <ArticleCard 
      v-for="(article, index) in articles" 
      :key="index" 
      :article="article" 
    />
  </div>
</template>

<style scoped>
.feed-wrapper {
  height: 100dvh;
  width: 100%;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
  position: relative;
}
.loading-screen, .refresh-indicator {
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #888;
  scroll-snap-align: start;
}
.refresh-indicator { height: 60px; position: absolute; top: 0; width: 100%; z-index: 10; background: rgba(0,0,0,0.8); }
.feed-wrapper::-webkit-scrollbar { display: none; }
</style>