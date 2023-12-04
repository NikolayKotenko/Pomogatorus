import Request from '@/services/request';

export default {
  namespaced: true,
  state: {
    listSearchedArticles: [],
    listSearchedPopularSelections: [],
    listSearchedNomenclature: [],
  },
  mutations: {
    setSearchedArticlesList(state, payload) {
      state.listSearchedArticles= []
      state.listSearchedArticles = payload
    },
  },
  actions: {
    // async getListSearchedArticles(symbols) {
    //   const result = await Request.get(
    //     `${this.$store.state.BASE_URL}/entity/articles/search/{q}?q=${symbols}`
    //   )
    //   this.
    // }
  },
  getters: {},
}
