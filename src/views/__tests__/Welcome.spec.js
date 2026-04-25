import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Welcome from '../Welcome.vue'
import { useUserStore } from '../../stores/user'
import { useUserStore } from '../../stores/user'

const mockRouter = {
  push: vi.fn()
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}))

describe('Welcome', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
    mockRouter.push.mockClear()
    // Reset user store
    const userStore = useUserStore()
    userStore.clearName()
  })

  it('renders welcome view', () => {
    const wrapper = mount(Welcome)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders input form', () => {
    const wrapper = mount(Welcome)
    const input = wrapper.find('input[type="text"]')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBe('What is your first name?')
  })

  it('sets name via form input', async () => {
    const wrapper = mount(Welcome)
    const input = wrapper.find('input[type="text"]')
    await input.setValue('John')
    expect(wrapper.vm.name).toBe('John')
  })

  it('calls enterApp on form submit with valid name', async () => {
    const wrapper = mount(Welcome)
    const input = wrapper.find('input[type="text"]')
    await input.setValue('Jane')

    const form = wrapper.find('form')
    await form.trigger('submit')

    const userStore = useUserStore()
    expect(userStore.name).toBe('Jane')
    expect(mockRouter.push).toHaveBeenCalledWith('/')
  })

  it('does not call enterApp with empty name', async () => {
    const wrapper = mount(Welcome)
    const form = wrapper.find('form')
    await form.trigger('submit')

    const userStore = useUserStore()
    expect(userStore.name).toBe('')
    expect(mockRouter.push).not.toHaveBeenCalled()
  })

  it('toggles manifesto overlay', async () => {
    const wrapper = mount(Welcome)
    expect(wrapper.vm.showManifesto).toBe(false)
    const trigger = wrapper.find('.manifesto-trigger')
    await trigger.trigger('click')
    expect(wrapper.vm.showManifesto).toBe(true)
    expect(wrapper.find('.manifesto-overlay').exists()).toBe(true)
  })
})
