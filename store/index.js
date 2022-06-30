import Vue from "vue";
import Vuex from 'vuex'

import AuthModule from "./modules/auth"
import ArticleModule from "./modules/article"

const createStore = () => {
  return new Vuex.Store({
    state: {
      BASE_URL: process.env.NODE_ENV === 'development' ? 'https://api-test.agregatorus.com' : 'https://api.agregatorus.com',
      show_header: false,
      breadcrumbs: [],
      agent_utm: null,
      changedCookie: false,
    },
    getters: {

    },
    mutations: {
      change_breadcrumbs(state, arr) {
        state.breadcrumbs = []
        state.breadcrumbs = arr
      },
      change_show_header(state, value) {
        state.show_header = value
      },
      change_agent_utm(state, value) {
        state.agent_utm = value
      },
      change_changedCookie(state, value) {
        state.changedCookie = value
      }
    },
    actions: {
      // nuxtServerInit({dispatch}) {
      //   dispatch('req_list_articles')
      // },
    },
    modules: {
      AuthModule,
      ArticleModule
    }
  })
}

export default createStore
