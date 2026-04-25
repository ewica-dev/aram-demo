import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    name: ''
  }),
  actions: {
    setName(newName) {
      this.name = newName
    },
    clearName() {
      this.name = ''
    }
  },
  persist: true
})
