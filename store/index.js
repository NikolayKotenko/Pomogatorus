import Vue from 'vue'
import Vuex from 'vuex'

import AuthModule from './modules/auth'
import ArticleModule from './modules/article'
import PopularSelectionsModule from './modules/popular-selections'

import Request from '../services/request'

const createStore = () => {
   return new Vuex.Store({
      state: {
         BASE_URL:
            process.env.NODE_ENV === 'development'
               ? 'https://api-test.agregatorus.com'
               : 'https://api.agregatorus.com',
         show_header: false,
         breadcrumbs: [],
         agent_utm: null,
         changedCookie: false,

         /* Objects */
         showCabinet: false,
         showDetailObj: false,
         loading_objects: false,
         listObjects: [],
         currentObject: {},
         idQuestionWhenModal: null,
      },
      getters: {
         open_close_cabinet(state) {
            return state.showCabinet
         },
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
         },
         change_listAgents(state, array) {
            state.listAgents = array
         },

         /* Objects */
         change_showCabinet(state, value) {
            state.showCabinet = value
         },
         change_showDetailObj(state, value) {
            state.showDetailObj = value
         },
         change_loaderObjects(state, value) {
            state.loading_objects = value
         },
         change_listObjects(state, array) {
            state.listObjects = array
         },
         set_currentObject(state, value) {
            state.currentObject = value
         },
         set_idQuestionWhenModal(state, value) {
            state.idQuestionWhenModal = value
         },
      },
      actions: {
         async getListObjects({ state, commit }) {
            state.loading_objects = true

            let { data } = await Request.get(
               state.BASE_URL + '/entity/objects',
               {
                  'filter[id_user]':
                     this.state.AuthModule.userData.user_data.id,
               }
            )
            commit('change_listObjects', data)
         },
         // nuxtServerInit({dispatch}) {
         //   dispatch('req_list_articles')
         // },
      },
      modules: {
         AuthModule,
         ArticleModule,
         PopularSelectionsModule,
      },
   })
}

export default createStore
