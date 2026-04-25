import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Vault from '../Vault.vue'
import ArticleCard from '../../components/ArticleCard.vue'
import { useArticlesStore } from '../../stores/articles'

// Mock vue-router
vi.mock('vue-router')

describe('Vault', () => {
  beforeEach(() => {
    localStorage.clear()
    // Reset store state
    const store = useArticlesStore()
    store.clearVault()
  })

  it('renders vault header', () => {
    const wrapper = mount(Vault)
    expect(wrapper.find('.vault-header').exists()).toBe(true)
  })

  it('renders back button', () => {
    const wrapper = mount(Vault)
    const backBtn = wrapper.find('.back-btn')
    expect(backBtn.exists()).toBe(true)
    expect(backBtn.text()).toContain('Back to Feed')
    // RouterLink mock renders <a> with href
    expect(backBtn.attributes('href')).toBe('/')
  })

  it('displays empty state when no saved articles', () => {
    const wrapper = mount(Vault)
    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.find('.empty-state p').text()).toContain('empty')
  })

  it('loads saved articles from store', async () => {
    const mockArticles = [
      {
        id: 1,
        title: 'Saved Article 1',
        url: 'https://example.com/1',
        score: 50,
        time: Math.floor(Date.now() / 1000)
      },
      {
        id: 2,
        title: 'Saved Article 2',
        url: 'https://example.com/2',
        score: 75,
        time: Math.floor(Date.now() / 1000)
      }
    ]

    const store = useArticlesStore()
    store.setVault(mockArticles)
    // No need for localStorage, the store is already set

    const wrapper = mount(Vault)
    await wrapper.vm.$nextTick()

    expect(wrapper.findAllComponents(ArticleCard)).toHaveLength(2)
  })

  it('does not render ArticleCard when no articles', () => {
    const wrapper = mount(Vault)
    expect(wrapper.findAllComponents(ArticleCard)).toHaveLength(0)
  })

  it('displays vault feed when articles exist', async () => {
    const mockArticles = [
      {
        id: 1,
        title: 'Saved Article',
        url: 'https://example.com/1',
        score: 50,
        time: Math.floor(Date.now() / 1000)
      }
    ]

    const store = useArticlesStore()
    store.setVault(mockArticles)

    const wrapper = mount(Vault)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.vault-feed').exists()).toBe(true)
  })
})
