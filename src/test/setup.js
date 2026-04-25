// Vitest global setup
import { beforeEach, afterEach, vi } from 'vitest'
import { flushPromises, config } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { h } from 'vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

let pinia

// Create fresh Pinia instance for each test
beforeEach(() => {
  pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  setActivePinia(pinia)
  config.global.plugins = [pinia]
})

// Cleanup after each test
afterEach(async () => {
  await flushPromises()
  // Clear pinia state
  if (pinia && pinia.state) {
    pinia.state.value = {}
  }
  // Clear localStorage
  window.localStorage.clear()
  // Reset any mocks
  vi.restoreAllMocks()
})

// Mock RouterLink component using render function for reliable href rendering
config.global.components = {
  RouterLink: {
    name: 'RouterLink',
    props: {
      to: {
        type: [String, Object],
        required: true
      }
    },
    setup(props, { slots }) {
      return () => {
        const href = typeof props.to === 'string' ? props.to : (props.to.path || '/')
        return h('a', { href }, slots.default ? slots.default() : [])
      }
    }
  }
}
