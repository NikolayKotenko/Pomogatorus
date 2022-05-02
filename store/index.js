export const state = () => ({
  list_articles: [],
})

export const mutations = {
  change_list_articles(state, arr) {
    state.list_articles = arr
  }
}

export const actions = {
  async nuxtServerInit ({dispatch}) {
    dispatch('req_list_articles')
  },
  async req_list_articles({state, commit}, params) {

  },
}
