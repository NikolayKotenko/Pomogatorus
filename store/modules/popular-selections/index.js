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
    loadingState: true,
  },
  mutations: {
    setMainTag(state, result) {
      state.main_tag = {}
      state.main_tag = result
    },
    setArticle(state, result) {
      state.article = []
      state.article = result
    },
    setQuestions(state, result) {
      state.questions = []
      state.questions = result
    },
    setPopularSelections(state, result) {
      state.popular_selections = {}
      state.popular_selections = result
    },
    setListSelections(state, result) {
      state.list_selections = []
      state.list_selections = result
    },
    setAnswer(state, payload) {
      console.log('payload 1', payload)
      const find = state.questions.find((elem) => elem.id === payload.id)
      if (find) {
        console.log('payload 2', find)
        find.answer = payload.answer
      }
    },
    change_loadingState(state, payload) {
      state.loadingState = payload
    },
  },
  actions: {
    async getListSelections({ commit }, queryParams) {
      commit('change_loadingState', true)

      const basedFilter = { public_field_filter: true }
      const query = constructFilterQuery({ ...basedFilter, ...queryParams })

      const response = await Request.get(
        this.state.BASE_URL + '/dictionary/tags' + query
      )
      commit('setListSelections', response.data)

      commit('change_loadingState', false)
      return response
    },
    async getSelections({ commit }, code) {
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
