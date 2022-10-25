export default {
  state: {
    list_articles: [],
    components_after_request: [],
    countLayout: 0,
    selectedComponent: {},
    count_of_questions: 0,
    intialized_app: false,
    refactoring_content: true,

    answers: [],
  },
  mutations: {
    set_answers(state, payload) {
      state.answers = payload
    },
    add_answers(state, payload) {
      let index = state.answers.findIndex((elem) => elem.id === payload.id)

      if (index !== -1) {
        state.answers.splice(index, 1, payload)
      } else {
        state.answers.push(payload)
      }
    },
    set_files_answer(state, payload) {
      let current = state.answers.find((elem) => elem.id === payload.id)
      if (current) {
        current.files = payload.files
      }
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
      const obj = Object.assign({}, { data, index: index, component })
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
  },
  actions: {
    async req_list_articles({ commit }) {
      try {
        const options = {
          method: 'GET',
          url: `${this.state.BASE_URL}/entity/articles`,
        }

        const list = await this.$axios(options)
        commit('change_list_articles', list.data.data)
      } catch (error) {
        console.log(error.response.data.message)
      }
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
        state.loadingModalList = false
        resolve()
      })
    },
    getComponentsById({ commit, state }, params) {
      return new Promise((resolve, reject) => {
        const { index, component } = params

        this.$axios
          .get(`${this.state.BASE_URL}/entity/${component.name}/${component.id}`, {
            headers: {
              Authorization: '666777',
            },
          })
          .then((response) => {
            const data = response.data.data
            console.log('uploaded COMPONENT')
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
  },
  getters: {},
}
