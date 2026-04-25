import { computed } from 'vue'

/**
 * Composable for formatting time ago from a timestamp
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {string} Formatted time ago string
 */
export function useTimeAgo(timestamp) {
  return computed(() => {
    if (!timestamp) return ''
    const secondsPast = Math.floor((Date.now() / 1000) - timestamp)
    if (secondsPast < 60) return `${secondsPast}s ago`
    if (secondsPast < 3600) return `${Math.floor(secondsPast / 60)}m ago`
    if (secondsPast < 86400) return `${Math.floor(secondsPast / 3600)}h ago`
    return `${Math.floor(secondsPast / 86400)}d ago`
  })
}