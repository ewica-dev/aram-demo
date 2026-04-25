<script setup>
import { computed } from 'vue'
import { useArticlesStore } from '../stores/articles'
import { useTimeAgo } from '@/composables/useTimeAgo'
import { useArticleDetails } from '@/composables/useArticleDetails'
import styles from '@/assets/css/articleCard.module.css'

const props = defineProps({
  article: Object
})

const articlesStore = useArticlesStore()

const isBookmarked = computed(() => articlesStore.isArticleSaved(props.article.id))

const toggleBookmark = () => {
  if (isBookmarked.value) {
    articlesStore.removeArticle(props.article.id)
  } else {
    articlesStore.addArticle(props.article)
  }
}

const timeAgo = useTimeAgo(props.article.time)

const {
  domain,
  publisherLogo,
  dynamicBackground,
  handleImageError
} = useArticleDetails(props.article)
</script>

<template>
  <div :class="styles['article-card']" :style="{ background: dynamicBackground }">
    <div :class="styles.content">
      <div :class="styles['meta-top']">
        <span :class="styles.score">▲ {{ article.score }} points</span>
        <span :class="styles.time">• {{ timeAgo }}</span>
      </div>

      <div :class="styles['emblem-container']">
        <img 
          :src="publisherLogo" 
          alt="Publisher Logo" 
          :class="styles['publisher-emblem']"
          @error="handleImageError"
        />
      </div>

      <h2 :class="styles.title">{{ article.title }}</h2>
      
      <div :class="styles['domain-tag']">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        {{ domain }}
      </div>
      
      <div :class="styles.actions">
        <a :href="article.url" target="_blank" :class="styles['read-btn']">Read Article</a>
        
        <button 
          @click="toggleBookmark" 
          :class="[styles['bookmark-btn'], { [styles['is-saved']]: isBookmarked }]"
        >
          {{ isBookmarked ? '★ Saved' : '☆ Save' }}
        </button>
      </div>
    </div>
  </div>
</template>