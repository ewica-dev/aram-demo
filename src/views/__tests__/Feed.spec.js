import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Feed from '../Feed.vue'
import ArticleCard from '../../components/ArticleCard.vue'

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() })
}))

// Mock the hackerNews service to avoid real network calls
vi.mock('../../services/hackerNews', () => ({
  default: {
    getTopStories: vi.fn(() => Promise.resolve([1, 2, 3])),
    getItem: vi.fn((id) => Promise.resolve({
      id,
      title: `Test Article ${id}`,
      url: `https://example.com/${id}`,
      score: 50 + id,
      time: Math.floor(Date.now() / 1000)
    }))
  }
}))

describe('Feed', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('renders greeting header', () => {
    const wrapper = mount(Feed, {
      global: {
        stubs: {
          RouterLink: false
        }
      }
    })
    expect(wrapper.find('.greeting-header').exists()).toBe(true)
  })

  it('renders loading state initially', () => {
    const wrapper = mount(Feed, {
      global: {
        stubs: {
          RouterLink: false
        }
      }
    })
    expect(wrapper.find('.loading-screen').exists()).toBe(true)
    expect(wrapper.find('.loading-screen').text()).toContain('Loading aram...')
  })

  it('displays time-based greeting', async () => {
    const mockDate = new Date(2026, 0, 1, 10, 0, 0)
    vi.setSystemTime(mockDate)

    const wrapper = mount(Feed, {
      global: {
        stubs: {
          RouterLink: false
        }
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Good morning')
  })

  it('displays afternoon greeting', async () => {
    const mockDate = new Date(2026, 0, 1, 14, 0, 0)
    vi.setSystemTime(mockDate)

    const wrapper = mount(Feed, {
      global: {
        stubs: {
          RouterLink: false
        }
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Good afternoon')
  })

  it('displays evening greeting', async () => {
    const mockDate = new Date(2026, 0, 1, 20, 0, 0)
    vi.setSystemTime(mockDate)

    const wrapper = mount(Feed, {
      global: {
        stubs: {
          RouterLink: false
        }
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Good evening')
  })

  it('fetches and displays articles on init', async () => {
    const wrapper = mount(Feed, {
      global: {
        stubs: {
          RouterLink: false
        }
      }
    })

    // Wait for async initialization
    await new Promise(resolve => setTimeout(resolve, 200))
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(wrapper.findAllComponents(ArticleCard)).toHaveLength(3)
  })

  it('handles fetch error during init', async () => {
    const mockHackerNews = await import('../../services/hackerNews')
    mockHackerNews.default.getTopStories.mockRejectedValueOnce(new Error('Network error'))

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(Feed, {
      global: {
        stubs: {
          RouterLink: false
        }
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('shows refresh indicator when refreshing', async () => {
    const wrapper = mount(Feed, {
      global: {
        stubs: {
          RouterLink: false
        }
      }
    })

    wrapper.vm.isRefreshing = true
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isRefreshing).toBe(true)
  })

  it('shows loading more indicator', async () => {
    const wrapper = mount(Feed, {
      global: {
        stubs: {
          RouterLink: false
        }
      }
    })

    wrapper.vm.isLoadingMore = true
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isLoadingMore).toBe(true)
  })

  it('shuffles array correctly', () => {
    const original = [1, 2, 3, 4, 5]
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (array.length - 1))
        ;[array[i], array[j]] = [array[j], array[i]]
      }
      return array
    }
    const shuffled = shuffleArray([...original])

    expect(shuffled).toHaveLength(5)
    expect(shuffled.sort()).toEqual([1, 2, 3, 4, 5])
  })
})
