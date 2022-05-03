export const state = () => ({
  list_articles: [],
  BASE_URL: process.env.NODE_ENV === 'development' ? 'https://api-test.agregatorus.com' : 'https://api.agregatorus.com',
})

export const mutations = {
  change_list_articles(state, arr) {
    state.list_articles = arr
  }
}

export const actions = {
  nuxtServerInit ({dispatch}) {
    dispatch('req_list_articles')
  },
  async req_list_articles({state, commit}, params) {
    try {
      const options = {
        method: 'GET',
        url: `${state.BASE_URL}/entity/articles`,
        headers: {
          Authorization: '666777'
        },
      }

      const list = await this.$axios(options)
      commit('change_list_articles', list.data.data)
      console.log(list)
    } catch (error) {
      console.log(error.response.data.message)
    }

  },
}
