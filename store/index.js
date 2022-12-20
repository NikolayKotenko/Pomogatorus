import Vuex from 'vuex'

import AuthModule from './modules/auth'
import PdfDataModule from './modules/pdf-data'
import ArticleModule from './modules/article'
import PopularSelectionsModule from './modules/popular-selections'
import UserSettings from './modules/userSettings'

import Request from '../services/request'

const createStore = () => {
  return new Vuex.Store({
    state: {
      BASE_URL:
        process.env.NODE_ENV === 'development' ? 'https://api-test.agregatorus.com' : 'https://api.agregatorus.com',
      show_header: false,
      breadcrumbs: [],
      defaultBreadcrumbs: [
        {
          text: 'Главная',
          disabled: false,
          link: true,
          exact: true,
          to: '/',
        },
      ],
      agent_utm: null,
      changedCookie: false,

      /* HEADER */
      drawer: false,

      /* Objects */
      showCabinet: false,
      isAnotherOpen: false,
      showDetailObj: false,
      loading_objects: false,
      listObjects: [],
      currentObject: {},
      idQuestionWhenModal: null,

      /* MODALS */
      listModal: [
        {
          name: 'UserInfo',
          isOpen: false,
          index: 1,
        },
        {
          name: 'ListObjects',
          isOpen: false,
          index: 2,
        },
        {
          name: 'ObjectDetail',
          isOpen: false,
          index: 3,
        },
      ],
      modalCurrentObject: {},
      list_tags: [],
    },
    getters: {
      getImageByEClientFilesObj: (state) => (eClientFilesObj) => {
        const templateImage =
          'https://cdn.dribbble.com/users/41613/screenshots/3848663/chronicle_prev.jpg?compress=1&resize=400x300'

        if (!eClientFilesObj) return ''

        const firstElem = eClientFilesObj.find((e) => e.preview_image === 1)
        return firstElem ? state.BASE_URL + firstElem.full_path : ''
      },
      open_close_cabinet(state) {
        return state.showCabinet
      },
      isSomeOpen(state) {
        return state.listModal.map((elem) => elem.isOpen).includes(true)
      },
      menuItems(state) {
        return [
          {
            title: 'Статьи',
            path: '/articles',
            icon: 'mdi-message-text',
            visible: true,
          },
          {
            title: 'Подборки',
            path: '/podborki',
            icon: 'mdi-bullseye-arrow',
            visible: true,
          },
          {
            title: 'Объекты',
            path: '/objects',
            icon: 'mdi-home',
            visible: true,
          },
          {
            title: 'Агенты',
            path: '/agents',
            icon: 'mdi-account-group',
            visible: Object.keys(state.AuthModule.userData).length ? state.AuthModule.userData.is_agent : false,
          },
        ]
      },
      stateObjectSelected(state){
        return Boolean(Object.keys(state.currentObject).length);
      }
    },
    mutations: {
      set_drawer(state, payload) {
        state.drawer = payload
      },
      change_breadcrumbs(state, arr) {
        // Очищаем
        state.breadcrumbs = []
        // Пишем дефолтные крошки (Главная)
        state.breadcrumbs.push(...state.defaultBreadcrumbs)
        // Если массив который пришел не определен то закончим
        if (arr === undefined || !arr.length) return false

        // Пушим массив с доп крошками
        state.breadcrumbs.push(...arr)
        // Дизейблим последнюю запись крошек
        state.breadcrumbs[state.breadcrumbs.length - 1].disabled = true
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

      /* MODALS */
      set_listModal(state, payload) {
        state.listModal = payload
      },
      set_list_tags(state, payload){
        state.list_tags = []
        state.list_tags = payload
      }
    },
    actions: {
      async getListObjects({ state, commit }) {
        state.loading_objects = true

        let { data } = await Request.get(state.BASE_URL + '/entity/objects', {
          'filter[id_user]': this.state.AuthModule.userData.id,
        })
        commit('change_listObjects', data)
      },
      async createNewObject({ state, commit, dispatch }, newObjAddress) {
        commit('change_loaderObjects', true)

        let { data } = await Request.post(state.BASE_URL + '/entity/objects', {
          address: newObjAddress,
        })

        await dispatch('loginByToken')

        if (state.AuthModule.userData.objects.length < 1) {
          commit('set_currentObject', data)
        }

        commit('change_listObjects', [data])

        commit('change_loaderObjects', false)
      },
      // nuxtServerInit({dispatch}) {
      //   dispatch('req_list_articles')
      // },
      async getListTags({ commit }) {
        const query = 'filter[public_field_filter]=true'
        const response = await Request.get(this.state.BASE_URL + '/dictionary/tags?' + query)
        commit('set_list_tags', response.data)
        return response
      },
    },
    modules: {
      AuthModule,
      ArticleModule,
      PopularSelectionsModule,
      UserSettings,
      PdfDataModule
    },
  })
}

export default createStore
