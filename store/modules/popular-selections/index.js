import Request from '@/services/request'
import constructFilterQuery from '~/utils/constructFilterQuery'

export default {
  namespaced: true,
  state: {
    list_selections: [],
    popular_selections: {},
    main_tag: {},
    article: [],
    questions: [],
    loadingState: false,
  },
  mutations: {
    setMainTag(state, result) {
      state.main_tag = {}
      state.main_tag = result

      state.loadingState = false
    },
    setArticle(state, result) {
      state.article = []
      state.article = result

      state.loadingState = false
    },
    setQuestions(state, result) {
      state.questions = []
      state.questions = result

      state.loadingState = false
    },
    setPopularSelections(state, result) {
      state.popular_selections = {}
      state.popular_selections = result

      state.loadingState = false
    },
    setListSelections(state, result) {
      state.list_selections = []
      state.list_selections = result

      state.loadingState = false
    },
    setAnswer(state, payload) {
      const find = state.questions.find((elem) => elem.id === payload.id)
      if (find) {
        find.answer = payload.answer
      }
    },
  },
  actions: {
    async getListSelections({ commit }, queryParams) {
      const basedFilter = { public_field_filter: true }
      const query = constructFilterQuery({ ...basedFilter, ...queryParams })

      const response = await Request.get(
        this.state.BASE_URL + '/dictionary/tags' + query
      )
      commit('setListSelections', response.data)
      return response
    },
    async getSelections({ commit }, code) {
      this.state.loadingState = true

      try {
        const response = await Request.get(
          `${this.state.BASE_URL}/entity/popular-selections/` + code
        )
        commit('setPopularSelections', response.data.data)
      } catch (error) {
        console.warn(error.response.data.message)
      }
    },
    async getMainTagInfo({ commit }, code) {
      this.state.loadingState = true

      try {
        const response = await Request.get(
          `${this.state.BASE_URL}/dictionary/tags-by-code/` + code
        )
        commit('setMainTag', response.data.data)
      } catch (error) {
        console.warn(error.response.data.message)
      }
    },
    async getArticlesInfo({ commit }, code) {
      const query = '?filter[tag][]=' + code
      const response = await Request.get(
        this.state.BASE_URL + '/entity/articles' + query
      )
      commit('setArticle', response.data)
      return response
    },
    async getQuestionsInfo({ commit }, code) {
      const query = '?filter[tag][]=' + code
      const response = await Request.get(
        this.state.BASE_URL + '/entity/questions' + query
      )

      response.data.forEach((elem) => {
        elem.answer = null
      })

      commit('setQuestions', response.data)
      return response
    },
  },
  getters: {},
}
