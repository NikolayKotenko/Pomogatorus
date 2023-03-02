import Request from '@/services/request'


export default {
  namespaced: true,
  state: {
    listArticles: [],
    listVariables: [],
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
    changeListVariables(state, array) {
      state.listVariables = array;
    },
  },
  actions: {
    async getArticlesBySymbols({ commit }, symbols) {
      if (! symbols) return false;
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout)

      this.debounceTimeout = setTimeout(async () => {
        commit('changeStateLoading', true);

        const result = await Request.get(
          `${this.state.BASE_URL}/entity/articles/search/{q}?q=${symbols}`
        );
        commit("changeListVariables", result.data);

        const response = await Request.get(
          this.state.BASE_URL + '/entity/articles?filter[name_or_tags]='+symbols
        );
        commit('setListArticles', response.data)
        commit('changeStateLoading', false);

        // console.log('getArticlesBySymbols - ', response)
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
