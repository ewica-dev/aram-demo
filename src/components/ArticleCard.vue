<script setup>
import { computed, ref, onMounted } from 'vue'

const props = defineProps({
  article: Object
})

const isBookmarked = ref(false)

// Check if this article is already saved when the card loads
onMounted(() => {
  const saved = JSON.parse(localStorage.getItem('aram_vault') || '[]')
  if (saved.some(item => item.id === props.article.id)) {
    isBookmarked.value = true
  }
})

const toggleBookmark = () => {
  let saved = JSON.parse(localStorage.getItem('aram_vault') || '[]')
  
  if (isBookmarked.value) {
    saved = saved.filter(item => item.id !== props.article.id)
  } else {
    saved.push(props.article)
  }
  
  localStorage.setItem('aram_vault', JSON.stringify(saved))
  isBookmarked.value = !isBookmarked.value
}

const domain = computed(() => {
  try { return new URL(props.article.url).hostname.replace('www.', '') } 
  catch { return 'news.ycombinator.com' }
})

// --- NEW: Editorial Emblem Logic ---
const publisherLogo = computed(() => {
  // Uses the extracted domain to fetch a high-res favicon via Google's API
  return `https://www.google.com/s2/favicons?domain=${domain.value}&sz=128`
})

// Failsafe: If a domain doesn't have a favicon, we hide the broken image icon
const handleImageError = (e) => {
  e.target.style.display = 'none'
}
// -----------------------------------

const dynamicBackground = computed(() => {
  const hue = (props.article.id || 0) % 360
  return `linear-gradient(135deg, hsl(${hue}, 15%, 15%), hsl(${(hue + 40) % 360}, 20%, 8%))`
})

const timeAgo = computed(() => {
  if (!props.article.time) return ''
  const secondsPast = Math.floor((Date.now() / 1000) - props.article.time)
  if (secondsPast < 60) return `${secondsPast}s ago`
  if (secondsPast < 3600) return `${Math.floor(secondsPast / 60)}m ago`
  if (secondsPast < 86400) return `${Math.floor(secondsPast / 3600)}h ago`
  return `${Math.floor(secondsPast / 86400)}d ago`
})
</script>

<template>
  <div class="article-card" :style="{ background: dynamicBackground }">
    <div class="content">
      <div class="meta-top">
        <span class="score">▲ {{ article.score }} points</span>
        <span class="time">• {{ timeAgo }}</span>
      </div>

      <div class="emblem-container">
        <img 
          :src="publisherLogo" 
          alt="Publisher Logo" 
          class="publisher-emblem"
          @error="handleImageError"
        />
      </div>

      <h2 class="title">{{ article.title }}</h2>
      
      <div class="domain-tag">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        {{ domain }}
      </div>
      
      <div class="actions">
        <a :href="article.url" target="_blank" class="read-btn">Read Article</a>
        
        <button 
          @click="toggleBookmark" 
          class="bookmark-btn" 
          :class="{ 'is-saved': isBookmarked }"
        >
          {{ isBookmarked ? '★ Saved' : '☆ Save' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-card {
  height: 100dvh;
  width: 100%;
  scroll-snap-align: start;
  scroll-snap-stop: always; 
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 30px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  user-select: none; 
}

.content { margin-bottom: 20px; }

.meta-top { 
  display: flex; 
  flex-wrap: wrap; 
  align-items: center; 
  gap: 12px; 
  margin-bottom: 20px; /* Increased slightly to give the emblem room */
  font-family: monospace; 
  font-size: 0.9rem; 
  color: #aaa; 
}

/* --- NEW: Emblem Styles --- */
.emblem-container {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.publisher-emblem {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.08); /* Dark frosted glass */
  padding: 10px;
  object-fit: contain;
  /* Applies the subtle cyan glow we established for the brand */
  box-shadow: 0 4px 20px rgba(0, 245, 212, 0.15); 
  border: 1px solid rgba(255, 255, 255, 0.08);
}
/* -------------------------- */

.score { color: #ff6600; font-weight: bold; }
.time { color: #666; }
.title { font-size: 2rem; font-weight: 800; line-height: 1.2; margin: 0 0 20px 0; letter-spacing: -0.5px; }
.domain-tag { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.1); padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; color: #ccc; margin-bottom: 30px; }
.actions { display: flex; gap: 12px; align-items: center; }
.read-btn { background: #fff; color: #000; padding: 15px 30px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 1rem; transition: transform 0.1s ease; }
.read-btn:active { transform: scale(0.95); }

/* Bookmark Button Styles */
.bookmark-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 12px 20px;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}
.bookmark-btn.is-saved {
  background: #ff6600; 
  border-color: #ff6600;
  color: #fff;
}
</style>