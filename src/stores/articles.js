import { defineStore } from 'pinia'

export const useArticlesStore = defineStore('articles', {
  state: () => ({
    vault: []
  }),
  getters: {
    getArticleById: (state) => (id) => {
      return state.vault.find(article => article.id === id)
    },
    isArticleSaved: (state) => (id) => {
      return state.vault.some(article => article.id === id)
    }
  },
  actions: {
    addArticle(article) {
      if (!this.isArticleSaved(article.id)) {
        this.vault.push(article)
      }
    },
    removeArticle(id) {
      this.vault = this.vault.filter(article => article.id !== id)
    },
    setVault(articles) {
      this.vault = articles
    },
    clearVault() {
      this.vault = []
    }
  },
  persist: true
})
