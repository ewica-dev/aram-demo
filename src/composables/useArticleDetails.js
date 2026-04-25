import { computed } from 'vue'

/**
 * Composable for extracting article details and presentation logic
 * @param {Object} article - The article object
 * @returns {Object} Object containing domain, publisherLogo, dynamicBackground, and handleImageError
 */
export function useArticleDetails(article) {
  const domain = computed(() => {
    try { return new URL(article.url).hostname.replace('www.', '') } 
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
    const hue = (article.id || 0) % 360
    return `linear-gradient(135deg, hsl(${hue}, 15%, 15%), hsl(${(hue + 40) % 360}, 20%, 8%))`
  })

  return {
    domain,
    publisherLogo,
    dynamicBackground,
    handleImageError
  }
}