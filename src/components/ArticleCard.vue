<script setup>
import { computed } from 'vue'

const props = defineProps({
  article: Object
})

// 1. Extract the clean domain name (e.g., "techcrunch.com")
const domain = computed(() => {
  try {
    return new URL(props.article.url).hostname.replace('www.', '')
  } catch {
    return 'news.ycombinator.com'
  }
})

// 2. Generate a unique, dark gradient background based on the article's unique HN ID
const dynamicBackground = computed(() => {
  const hue = (props.article.id || 0) % 360
  return `linear-gradient(135deg, hsl(${hue}, 15%, 15%), hsl(${(hue + 40) % 360}, 20%, 8%))`
})
</script>

<template>
  <div class="article-card" :style="{ background: dynamicBackground }">
    <div class="content">
      <div class="meta-top">
        <span class="score">▲ {{ article.score }} points</span>
        <span class="author">by {{ article.by }}</span>
      </div>

      <h2 class="title">{{ article.title }}</h2>
      
      <div class="domain-tag">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        {{ domain }}
      </div>
      
      <div class="actions">
        <a :href="article.url" target="_blank" class="read-btn">Read Article</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-card {
  height: 100dvh;
  width: 100%;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* Push content to the bottom */
  padding: 30px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.content {
  margin-bottom: 20px;
}

.meta-top {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  font-family: monospace;
  font-size: 0.9rem;
  color: #aaa;
}

.score {
  color: #ff6600; /* Hacker News Orange */
  font-weight: bold;
}

.title {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 20px 0;
  letter-spacing: -0.5px;
}

.domain-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,0.1);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #ccc;
  margin-bottom: 30px;
}

.actions {
  display: flex;
  justify-content: flex-start;
}

.read-btn {
  background: #fff;
  color: #000;
  padding: 15px 30px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1rem;
  transition: transform 0.1s ease;
}

.read-btn:active {
  transform: scale(0.95);
}
</style>