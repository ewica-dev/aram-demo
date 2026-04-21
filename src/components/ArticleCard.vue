<script setup>
import { computed } from 'vue'

const props = defineProps({
  article: Object
})

const bgImage = computed(() => {
  return props.article.urlToImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop'
})
</script>

<template>
  <div class="article-card" :style="{ backgroundImage: `url(${bgImage})` }">
    <div class="gradient-overlay">
      <div class="content">
        <h2 class="title">{{ article.title }}</h2>
        <p class="description">{{ article.description || 'Tap below to read the full story on the original source.' }}</p>
        
        <div class="actions">
          <a :href="article.url" target="_blank" class="read-btn">Read Full Article</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-card {
  height: 100dvh;
  width: 100%;
  scroll-snap-align: start;
  background-size: cover;
  background-position: center;
  position: relative;
}
.gradient-overlay {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 70%;
  background: linear-gradient(to top, rgba(0,0,0,1) 10%, rgba(0,0,0,0.8) 50%, transparent);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 25px;
}
.content {
  margin-bottom: 20px;
}
.title {
  font-size: 1.8rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 10px 0;
  text-shadow: 1px 1px 10px rgba(0,0,0,0.5);
}
.description {
  font-size: 1rem;
  color: #ccc;
  line-height: 1.5;
  margin-bottom: 25px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.read-btn {
  background: #fff;
  color: #000;
  padding: 12px 24px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  font-size: 0.9rem;
}
</style>