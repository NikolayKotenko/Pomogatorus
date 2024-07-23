import Request from '../../../services/request'
import constructFilterQuery from '../../../utils/constructFilterQuery'

export default {
  state: {
    list_articles: [],
    components_after_request: [],
    countLayout: 0,
    selectedComponent: {},
    count_of_questions: 0,
    intialized_app: false,
    refactoring_content: true,
    list_filtered_articles: [],
    answers: [],
    totalImages: [],
    indexImage: 0,
    answersFromServer: [],
    isAnswered: false,
    isLoadingAnswers: true,
    stateShareArticleModal: false,
  },
  mutations: {
    /* ANSWERS */
    set_answers_from_server(state, payload) {
      state.answersFromServer = payload
    },
    set_is_loading_answers(state, payload) {
      state.isLoadingAnswers = payload
    },

    set_is_answered(state, payload) {
      state.isAnswered = payload
    },
    set_answers(state, payload) {
      state.answers = payload
    },
    add_answers(state, payload) {
      const index = state.answers.findIndex((elem) => elem.id === payload.id)

      if (index !== -1) {
        state.answers.splice(index, 1, payload)
      } else {
        state.answers.push(payload)
      }
    },
    set_files_answer(state, payload) {
      const current = state.answers.find((elem) => elem.id === payload.id)
      if (current) {
        current.files = payload.files
      }
    },
    set_list_filtered_articles(state, payload) {
      state.list_filtered_articles = []
      state.list_filtered_articles = payload
    },

    change_refactoring_content(state, value) {
      state.refactoring_content = value
    },
    change_list_articles(state, arr) {
      state.list_articles = arr
    },
    change_inititalize_state(state, value) {
      state.intialized_app = value
    },
    // CONTENT
    changeSelectedComponent(state, { data, index, component }) {
      const obj = Object.assign({}, { data, index, component })
      state.components_after_request.push(obj)
    },
    M_count_of_questions(state, data) {
      state.count_of_questions = data
    },
    M_countLayout(state, data) {
      state.countLayout = data
    },
    M_selectedComponent(state, data) {
      state.selectedComponent = data
    },
    add_total_image(state, data) {
      state.totalImages.push(data)
    },
    clear_total_image(state) {
      state.totalImages = []
    },
    set_index_image(state, payload) {
      if (state.indexImage === payload) {
        state.indexImage = -1
      } else {
        state.indexImage = payload
      }
    },
    set_state_share_article_modal(state, payload) {
      state.stateShareArticleModal = payload
    },
  },
  actions: {
    openShareArticleModal({ commit }) {
      commit('set_state_share_article_modal', true)
    },
    closeShareArticleModal({ commit }) {
      commit('set_state_share_article_modal', false)
    },
    async req_list_articles({ commit }) {
      try {
        const query = 'filter[activity]=true'
        const { data } = await Request.get(
          `${this.state.BASE_URL}/entity/articles?${query}`
        )
        return data
      } catch (error) {
        console.warn(error.response.data.message)
      }
    },
    async getListArticles({ commit }, extQueryString) {
      const query1 = constructFilterQuery({ activity: true })
      const query = query1 + extQueryString

      const response = await Request.get(
        `${this.state.BASE_URL}/entity/articles${query}`
      )
      commit('set_list_filtered_articles', response.data)
      return response
    },

    // CONTENT
    getAuth({ commit, state }, params) {
      return new Promise((resolve) => {
        const { index, component } = params

        state.loadingModalList = true

        const data = {
          name: 'auth',
        }

        commit('changeSelectedComponent', {
          data,
          index,
          component,
        })
        state.loadingModalList = false
        resolve()
      })
    },
    nomenclatureFromServer({ commit, state }, params) {
      return new Promise((resolve) => {
        const { index, component } = params

        state.loadingModalList = true

        const data = {
          name: 'nomenclature',
          id: component.id,
          nomenclatures_id: component.nomenclatures_id,
          index_nomenclature: component.index_nomenclature,
        }

        commit('changeSelectedComponent', { data, index, component })
        state.loadingModalList = false
        resolve()
      })
    },
    imageFromServer({ commit, state }, params) {
      return new Promise((resolve) => {
        const { index, component } = params

        state.loadingModalList = true

        const data = {
          name: 'image',
        }

        commit('changeSelectedComponent', {
          data,
          index,
          component,
        })
        commit('add_total_image', component)
        state.loadingModalList = false
        resolve()
      })
    },
    getComponentsById({ commit, state }, params) {
      return new Promise((resolve, reject) => {
        const { index, component } = params

        Request.get(
          `${this.state.BASE_URL}/entity/${component.name}/${component.id}`
        )
          .then((response) => {
            const data = response.data
            // console.log('uploaded COMPONENT')
            commit('changeSelectedComponent', {
              data,
              index,
              component,
            })
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    setIsAnswered({ commit }) {
      commit('set_is_answered', true)

      setTimeout(() => {
        commit('set_is_answered', false)
      }, 2000)
    },
    linkToArticle(_, articleId) {
      window.location.href = '/articles/' + articleId
    },

    /* ANSWERS */
    async getAnswersFromServer({ commit }, payload) {
      commit('set_is_loading_answers', true)

      const query = Request.ConstructFilterQuery(payload)

      const data = await Request.get(
        `${this.state.BASE_URL}/entity/answers${query}`
      )

      commit('set_answers_from_server', data?.data ?? [])

      commit('set_is_loading_answers', false)
    },
  },
  getters: {
    getQuestionAnswer: (state) => (id) => {
      return state.answersFromServer.find((answer) => answer.id_question === id)
    },
  },
}
