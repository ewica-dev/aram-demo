<script setup>
import { ref, onMounted } from 'vue'
import ArticleCard from '../components/ArticleCard.vue'
import { computed } from 'vue'

const userName = ref(localStorage.getItem('aram_user_name') || '')

/**
 * Computes greeting based on current hour.
 * @returns {string} Time-based greeting (morning, afternoon, evening)
 */
const timeBasedGreeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})

const articles = ref([])
const loading = ref(true)
const feedContainer = ref(null)

// Touch & Scroll States
const startY = ref(0)
const isRefreshing = ref(false)
const isLoadingMore = ref(false)

// Algorithm Memory
const allStoryIds = ref([])
const seenIds = ref(new Set())

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const initFeed = async () => {
  loading.value = true
  try {
    const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
    const ids = await res.json()
    allStoryIds.value = shuffleArray(ids) 
    
    // Initial boot: fetch 10 items, attach to bottom (isRefresh = false)
    await loadMoreNews(10)
  } catch (error) {
    console.error("Failed to init feed:", error)
  } finally {
    loading.value = false
  }
}

// The Upgraded Engine: The 'isRefresh' boolean tells it to wipe the feed
const loadMoreNews = async (count, isRefresh = false) => {
  const newIds = []
  
  while (newIds.length < count && allStoryIds.value.length > 0) {
    const id = allStoryIds.value.pop()
    if (!seenIds.value.has(id)) {
      newIds.push(id)
      seenIds.value.add(id)
    }
  }

  if (newIds.length === 0) return 

  const itemPromises = newIds.map(id => 
    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
  )
  
  const items = await Promise.all(itemPromises)
  const validItems = items.filter(item => item !== null && item.url)

  if (isRefresh) {
    // PULL TO REFRESH: Replace the entire feed with the new batch
    articles.value = validItems
    // Force the container back to the absolute top to reset the scroll position
    if (feedContainer.value) {
      feedContainer.value.scrollTop = 0
    }
  } else {
    // INFINITE SCROLL / BOOTUP: Attach new cards to the BOTTOM
    articles.value = [...articles.value, ...validItems]
  }
}

// --- NEW: INFINITE SCROLL LOGIC ---
const onScroll = async () => {
  if (!feedContainer.value) return

  const { scrollTop, scrollHeight, clientHeight } = feedContainer.value
  
  // If the user scrolls within 200px of the very bottom...
  if (scrollTop + clientHeight >= scrollHeight - 200) {
    // ...and we aren't already loading something...
    if (!isLoadingMore.value && !loading.value) {
      isLoadingMore.value = true
      await loadMoreNews(5, true) // ...fetch 5 more and put them at the bottom!
      isLoadingMore.value = false
    }
  }
}

const onTouchStart = (e) => {
  if (feedContainer.value && feedContainer.value.scrollTop === 0) {
    startY.value = e.touches[0].clientY
  }
}

const onTouchMove = async (e) => {
  if (feedContainer.value && feedContainer.value.scrollTop === 0 && startY.value > 0) {
    const currentY = e.touches[0].clientY
    
    if (currentY - startY.value > 80 && !isRefreshing.value) {
      isRefreshing.value = true
      startY.value = 0 
      
      // Fetch a brand new hand of 10 and WIPE the current feed (isRefresh = true)
      await loadMoreNews(10, true) 
      
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
    @scroll="onScroll" 
  >
    <div class="greeting-header">
      <div class="greeting-text">
        {{ timeBasedGreeting }}, <span class="highlight">{{ userName }}</span>.
      </div>
      <router-link to="/vault" class="vault-link">View Vault ★</router-link>
    </div>
    <div v-if="isRefreshing" class="refresh-indicator">
      <span>↓ Fetching fresh stories...</span>
    </div>

    <div v-if="loading && !isRefreshing" class="loading-screen">Loading aram...</div>
    
    <ArticleCard 
      v-for="article in articles" 
      :key="article.id" 
      :article="article" 
    />

    <div v-if="isLoadingMore" class="loading-more">
      <span>Loading more...</span>
    </div>
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

.loading-screen {
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #888;
  scroll-snap-align: start;
}

/* Updated Pull-to-refresh styling */
.refresh-indicator { 
  height: 60px; 
  position: sticky; 
  top: 0; 
  width: 100%; 
  z-index: 10; 
  background: rgba(0,0,0,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-family: monospace;
}

/* New Infinite Scroll loader styling */
.loading-more {
  height: 100dvh; /* Takes up a full swipe so it snaps perfectly */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-family: monospace;
  scroll-snap-align: start;
  background: #000;
}

.feed-wrapper::-webkit-scrollbar { display: none; }

.greeting-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 30px 20px;
  z-index: 50;
  background: linear-gradient(to bottom, rgba(0,0,0,0.9) 30%, transparent);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vault-link {
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
  color: #fff;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: bold;
  backdrop-filter: blur(5px);
  pointer-events: auto; /* Important: allow clicking this while header is floating */
}

.highlight {
  color: #fff;
  font-weight: bold;
}
</style>