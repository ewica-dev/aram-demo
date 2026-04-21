<script setup>
import { ref, onMounted } from 'vue'
import ArticleCard from '../components/ArticleCard.vue'

const articles = ref([])
const loading = ref(true)
const feedContainer = ref(null)
const startY = ref(0)
const isRefreshing = ref(false)

// --- THE ALGORITHM STATE ---
const allStoryIds = ref([]) // Our "deck of cards"
const seenIds = ref(new Set()) // The memory of what you've scrolled past

// 1. The Randomizer (Fisher-Yates Shuffle)
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 2. The Initial Bootup
const initFeed = async () => {
  loading.value = true
  try {
    // Grab all ~500 top stories
    const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
    const ids = await res.json()
    
    // Shuffle the entire deck so every session is unique
    allStoryIds.value = shuffleArray(ids) 
    
    // Deal the first 10 cards
    await loadMoreNews(10)
  } catch (error) {
    console.error("Failed to init feed:", error)
  } finally {
    loading.value = false
  }
}

// 3. The Engine
const loadMoreNews = async (count) => {
  const newIds = []
  
  // Pluck unseen IDs from our shuffled deck
  while (newIds.length < count && allStoryIds.value.length > 0) {
    const id = allStoryIds.value.pop()
    if (!seenIds.value.has(id)) {
      newIds.push(id)
      seenIds.value.add(id) // Mark as seen so we never show it again
    }
  }

  if (newIds.length === 0) return // The deck is empty

  const itemPromises = newIds.map(id => 
    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
  )
  
  const items = await Promise.all(itemPromises)
  const validItems = items.filter(item => item !== null && item.url)

  // Inject the new items at the TOP of the feed
  articles.value = [...validItems, ...articles.value]
}

// --- TOUCH EVENTS ---
const onTouchStart = (e) => {
  if (feedContainer.value && feedContainer.value.scrollTop === 0) {
    startY.value = e.touches[0].clientY
  }
}

const onTouchMove = async (e) => {
  if (feedContainer.value && feedContainer.value.scrollTop === 0 && startY.value > 0) {
    const currentY = e.touches[0].clientY
    
    // If they pulled down far enough
    if (currentY - startY.value > 80 && !isRefreshing.value) {
      isRefreshing.value = true
      startY.value = 0
      
      // Inject 5 brand new, unseen, random stories at the top
      await loadMoreNews(5) 
      
      isRefreshing.value = false
    }
  }
}

const onTouchEnd = () => { startY.value = 0 }

onMounted(() => { initFeed() })
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