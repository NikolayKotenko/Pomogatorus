import Vue from "vue";
import Vuex from 'vuex'
import Request from "../services/request";

const createStore = () => {
  return new Vuex.Store({
    state: {
      list_articles: [],
      BASE_URL: process.env.NODE_ENV === 'development' ? 'https://api-test.agregatorus.com' : 'https://api.agregatorus.com',

      /* TODO: need module */
      userData: {},
      components_after_request: [],
      countLayout: 0,
      selectedComponent: {},
      count_of_questions: 0,
      intialized_app: false,
    },
    getters: {
      stateAuth(state){
        return Object.keys(state.userData).length !== 0
      },
      checkAdminPanel(){
        if (!process.env.VUE_APP_SERVER)
          return false

        return Boolean(process.env.VUE_APP_SERVER.match('admin'))
      },
    },
    mutations: {
      change_list_articles(state, arr) {
        state.list_articles = arr
      },
      change_inititalize_state(state, value) {
        state.intialized_app = value
      },

      //  AUTH
      set_user_data(state, result) {
        state.userData = []
        state.userData = result

        // if (!result.access_token)
        //   return false
        //
        // const {token, defined_ttl_minutes} = result.access_token;
        //
        // this.$cookiz.set("accessToken", token, {maxAge: defined_ttl_minutes});
      },
      // CONTENT
      changeSelectedComponent(state, {data, index, component}) {
        const obj = Object.assign({}, {data, index: index, component})
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
      }
    },
    actions: {
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
        } catch (error) {
          console.log(error.response.data.message)
        }
      },

      // AUTH
      async refreshTokens({commit}){
        const tokensData = await Request.post(window.location.origin + '/api/auth/refresh')
        commit('set_user_data', tokensData.data)
        return tokensData
      },
      async loginUser({commit}, objData) {
        const tokensData = await Request.post(window.location.origin + '/api/auth/login', objData)
        commit('set_user_data', tokensData.data)

        return tokensData
      },
      async createAndAuthUserByEmail(_, objData) {
        //Делаем запрос на создание пользователя, если такой есть то будет 409 конфликт ошибка ну и бог с ней
        return await Request.post(this.state.BASE_URL+'/users/create-from-only-email', objData)
      },

      // CONTENT
      getAuth({commit, state}, params) {
        return new Promise((resolve) => {
          const {index, component} = params

          state.loadingModalList = true

          const data = {
            name: 'auth'
          }

          commit('changeSelectedComponent', {data, index, component})
          state.loadingModalList = false
          resolve()
        })
      },
      imageFromServer({commit, state}, params) {
        return new Promise((resolve) => {
          const {index, component} = params

          state.loadingModalList = true

          const data = {
            name: 'image'
          }

          commit('changeSelectedComponent', {data, index, component})
          state.loadingModalList = false
          resolve()
        })
      },
      getComponentsById({commit, state}, params) {
        return new Promise((resolve, reject) => {
          const {index, component} = params

          this.$axios.get(`${state.BASE_URL}/entity/${component.name}/${component.id}`, {
            headers: {
              Authorization: '666777'
            },
          })
            .then((response) => {
              const data = response.data.data
              console.log('uploaded COMPONENT')
              commit('changeSelectedComponent', {data, index, component})
              resolve()
            })
            .catch((error) => {
              reject(error)
            })
        })
      },
    }
  })
}

export default createStore

// export const state = () => ({
//
// })
//
// export const mutations = {
//
// }
//
// export const actions = {
//
// }
//
// // TODO: modules
// export const getters = {
//
// }
