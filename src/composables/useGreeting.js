import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

/**
 * Composable for handling time-based greeting and user name
 * @returns {Object} Object containing timeBasedGreeting and userName
 */
export function useGreeting() {
  const userStore = useUserStore()
  const userName = computed(() => userStore.name)

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

  return {
    timeBasedGreeting,
    userName
  }
}