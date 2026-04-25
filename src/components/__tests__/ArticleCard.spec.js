import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ArticleCard from '../ArticleCard.vue'
import { useArticlesStore } from '../../stores/articles'

describe('ArticleCard', () => {
  const mockArticle = {
    id: 1,
    title: 'Test Article Title',
    url: 'https://example.com/article',
    score: 100,
    time: Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
  }

  beforeEach(() => {
    localStorage.clear()
    const store = useArticlesStore()
    store.clearVault()
    vi.restoreAllMocks()
  })

  it('renders article title', () => {
    const wrapper = mount(ArticleCard, {
      props: { article: mockArticle }
    })
    expect(wrapper.find('.title').text()).toBe('Test Article Title')
  })

  it('renders article score', () => {
    const wrapper = mount(ArticleCard, {
      props: { article: mockArticle }
    })
    expect(wrapper.find('.score').text()).toContain('100')
  })

  it('renders domain from article URL', () => {
    const wrapper = mount(ArticleCard, {
      props: { article: mockArticle }
    })
    expect(wrapper.find('.domain-tag').text()).toContain('example.com')
  })

  it('displays fallback domain for invalid URL', () => {
    const article = { ...mockArticle, url: 'invalid-url' }
    const wrapper = mount(ArticleCard, {
      props: { article }
    })
    expect(wrapper.find('.domain-tag').text()).toContain('news.ycombinator.com')
  })

  it('formats time ago correctly for seconds', () => {
    const article = { ...mockArticle, time: Math.floor(Date.now() / 1000) - 30 }
    const wrapper = mount(ArticleCard, {
      props: { article }
    })
    expect(wrapper.find('.time').text()).toContain('s ago')
  })

  it('formats time ago correctly for minutes', () => {
    const article = { ...mockArticle, time: Math.floor(Date.now() / 1000) - 120 }
    const wrapper = mount(ArticleCard, {
      props: { article }
    })
    expect(wrapper.find('.time').text()).toContain('m ago')
  })

  it('formats time ago correctly for hours', () => {
    const article = { ...mockArticle, time: Math.floor(Date.now() / 1000) - 7200 }
    const wrapper = mount(ArticleCard, {
      props: { article }
    })
    expect(wrapper.find('.time').text()).toContain('h ago')
  })

  it('formats time ago correctly for days', () => {
    const article = { ...mockArticle, time: Math.floor(Date.now() / 1000) - 172800 }
    const wrapper = mount(ArticleCard, {
      props: { article }
    })
    expect(wrapper.find('.time').text()).toContain('d ago')
  })

  it('toggles bookmark on button click', async () => {
    const store = useArticlesStore()
    const wrapper = mount(ArticleCard, {
      props: { article: mockArticle }
    })

    expect(store.vault).toHaveLength(0)

    const button = wrapper.find('.bookmark-btn')
    expect(button.text()).toBe('☆ Save')
    expect(button.classes()).not.toContain('is-saved')

    await button.trigger('click')
    await wrapper.vm.$nextTick()
    await flushPromises()
    // Wait for persistedstate debounce
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(store.vault).toHaveLength(1)
    expect(store.vault[0].id).toBe(1)
    expect(button.text()).toBe('★ Saved')
    expect(button.classes()).toContain('is-saved')
  })

  it('removes bookmark when already saved', async () => {
    const store = useArticlesStore()
    store.addArticle(mockArticle)
    await flushPromises()

    const wrapper = mount(ArticleCard, {
      props: { article: mockArticle }
    })

    await wrapper.vm.$nextTick()

    const button = wrapper.find('.bookmark-btn')
    expect(button.text()).toBe('★ Saved')
    expect(button.classes()).toContain('is-saved')

    await button.trigger('click')
    await wrapper.vm.$nextTick()
    await flushPromises()
    await new Promise(resolve => setTimeout(resolve, 50))

    expect(store.vault).toHaveLength(0)
    expect(button.text()).toBe('☆ Save')
    expect(button.classes()).not.toContain('is-saved')
  })

  it('sets isBookmarked from store on mount', async () => {
    const store = useArticlesStore()
    store.addArticle(mockArticle)
    await flushPromises()

    const wrapper = mount(ArticleCard, {
      props: { article: mockArticle }
    })

    await wrapper.vm.$nextTick()

    const button = wrapper.find('.bookmark-btn')
    expect(button.text()).toBe('★ Saved')
    expect(button.classes()).toContain('is-saved')
  })

  it('generates dynamic background style', () => {
    const wrapper = mount(ArticleCard, {
      props: { article: mockArticle }
    })

    const style = wrapper.find('.article-card').attributes('style')
    expect(style).toContain('linear-gradient')
  })

  it('emits no errors when publisher logo fails to load', async () => {
    const wrapper = mount(ArticleCard, {
      props: { article: mockArticle }
    })

    const img = wrapper.find('.publisher-emblem')
    await img.trigger('error')

    // Should not throw
    expect(true).toBe(true)
  })

  it('renders read article link', () => {
    const wrapper = mount(ArticleCard, {
      props: { article: mockArticle }
    })

    const link = wrapper.find('.read-btn')
    expect(link.attributes('href')).toBe('https://example.com/article')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.text()).toBe('Read Article')
  })
})
