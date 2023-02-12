import Request from '@/services/request'


export default {
  namespaced: true,
  state: {
    listArticles: [],
    loading: false,
    debounceTimeout: null,
  },
  mutations: {
    changeStateLoading(state, boolean){
      state.loading = boolean;
    },
    setListArticles(state, payload) {
      state.listArticles = [];
      state.listArticles = payload
    },
  },
  actions: {
    async getArticlesBySymbols({ commit }, symbols) {
      if (! symbols) return false;
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout)

      this.debounceTimeout = setTimeout(async () => {
        commit('changeStateLoading', true);

        const queryFilter = '?filter[name]=' + symbols;
        const response = await Request.get(
          this.state.BASE_URL + '/entity/articles' + queryFilter
        );
        commit('setListArticles', response.data)
        commit('changeStateLoading', false);

        console.log('getArticlesBySymbols - ', response)
        return response;

      }, 1000)
    },
    async getListBasedArticles({ commit }){
      commit('changeStateLoading', true);

      const queryFilter = '?filter[activity]=true';
      const response = await Request.get(
        this.state.BASE_URL + '/entity/articles' + queryFilter
      );
      commit('setListArticles', response.data)
      commit('changeStateLoading', false);

      return response;
    }
  },
  getters: {},
}
