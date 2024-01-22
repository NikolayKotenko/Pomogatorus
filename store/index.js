import Vuex from 'vuex'

import Request from '../services/request'
import AuthModule from './modules/auth'
import PdfDataModule from './modules/pdf-data'
import ArticleModule from './modules/article'
import PopularSelectionsModule from './modules/popular-selections'
import UserSettings from './modules/userSettings'
import SearchModule from './modules/search'
import Tabs from './modules/tabs'
import Objects from './modules/objects'
import CollaborationModule from './modules/collaboration'
import NomenclatureModule from './modules/nomenclature'
import NotificationModule from './modules/notification'


const createStore = () => {
  return new Vuex.Store({
    state: {
      BASE_URL:
        process.env.NODE_ENV === 'development'
          ? 'https://api.agregatorus.com'
          : 'https://api.agregatorus.com',
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
      stateVerticalMenu: true,
      listSearched: [],

      /* Objects */
      showCabinet: false,
      isAnotherOpen: false,
      showDetailObj: false,
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
      list_tags: [],
      list_broadcast_snippet: [],
    },
    getters: {
      getImageByEClientFilesObj: (state) => (eClientFilesObj) => {
        const templateImage =
          'https://cdn.dribbble.com/users/41613/screenshots/3848663/chronicle_prev.jpg?compress=1&resize=400x300'

        if (!eClientFilesObj) return ''

        const firstElem = eClientFilesObj.find((e) => e.preview_image === true)
        return firstElem ? state.BASE_URL + firstElem.full_path : ''
      },
      getImageMainPhotoObjects: (state) => (obj) => {
        const templateImage =
          'https://cdn.dribbble.com/users/41613/screenshots/3848663/chronicle_prev.jpg?compress=1&resize=400x300'

        if (!obj) return ''

        return state.BASE_URL + obj.full_path
      },
      getMainPhotoObject: (state) => (obj) => {
        if (!obj.hasOwnProperty('osnovnoe-foto-obekta')) return null

        const firstImage = obj['osnovnoe-foto-obekta'].filter((item) => {
          return item.main_photo_object === true
        })
        return firstImage ? firstImage[0] : null
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
            title: 'Главная',
            path: '/',
            icon: 'mdi-home-variant-outline',
            visible: false,
          },
          {
            title: 'Статьи',
            path: '/articles',
            icon: 'mdi-card-text-outline',
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
            icon: 'mdi-home-city-outline',
            visible: true,
          },
          {
            title: 'Оборудование',
            path: '/products',
            icon: 'mdi-store-cog-outline',
            visible: true,
          },
          {
            title: 'Уведомления',
            path: '/notifications',
            icon: 'mdi-bell-outline',
            visible: true,
          },
          {
            title: 'Агенты',
            path: '/agents',
            icon: 'mdi-account-group',
            visible: Object.keys(state.AuthModule.userData).length
              ? state.AuthModule.userData.is_agent
              : false,
          },
          {
            title: 'Тесты',
            path: '/tests',
            icon: 'mdi-home',
            visible: false,
          },
        ]
      },
      optionsDropzone(state) {
        return {
          url: state.BASE_URL + '/entity/files',
          destroyDropzone: false,
          duplicateCheck: true,
          headers: {
            Authorization: 'Bearer ' + Request.getAccessTokenInCookies(),
          },
        }
      },
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
      set_idQuestionWhenModal(state, value) {
        state.idQuestionWhenModal = value
      },

      /* MODALS */
      set_listModal(state, payload) {
        state.listModal = payload
      },
      set_list_tags(state, payload) {
        state.list_tags = []
        state.list_tags = payload
      },
      set_list_broadcast_snippet(state, payload) {
        state.list_broadcast_snippet = []
        state.list_broadcast_snippet = payload
      },
      set_modal_auth(state, payload) {
        state.listModal[0].isOpen = payload
      },

      /* HEADERS */
      set_list_searched(state, payload) {

        payload.map((elem) => {
          elem.href = ''
          if (elem.category === 'Статьи') {
            elem.href = '/articles/' + elem.data.id
          }
          if (elem.category === 'Номенклатура') {
            elem.href = '/nomenclature/' + elem.data.id
          }
          if (elem.category === 'Подборки') {
            elem.href = '/podborki/' + elem.data.code
          }
        })
        state.listSearched = payload
      }
    },
    actions: {
      // nuxtServerInit({dispatch}) {
      //   dispatch('req_list_articles')
      // },
      async getListTags({ commit }) {
        const query = 'filter[public_field_filter]=true'
        const response = await Request.get(
          this.state.BASE_URL + '/dictionary/tags?' + query
        )
        commit('set_list_tags', response.data)
        return response
      },
      async getListBroadcastSnippet({ commit, rootGetters }) {
        if (! rootGetters.stateAuth) return false;

        const query = 'filter[broadcast_to_snippet]=true'
        const response = await Request.get(
          this.state.BASE_URL + '/dictionary/object-properties?' + query
        )
        commit('set_list_broadcast_snippet', response.data)
        return response
      },
      async getFilesByFilter({ state }, objFilter) {
        return await Request.get(
          state.BASE_URL +
            '/entity/files' +
            Request.ConstructFilterQuery(objFilter)
        )
      },
      async addFile({ state }, data) {
        if (data.codeProperty === 'osnovnoe-foto-obekta') {
          data.main_photo_object = true
        }

        return await Request.post(state.BASE_URL + '/entity/files', data, true)
      },

      async getListSearched({ commit }, symbols) {
        const response = await Request.get(
          this.state.BASE_URL + `/entity/global-search/search/{q}?q=${symbols}`
        );
        commit('set_list_searched', response.data)
      }
    },
    modules: {
      AuthModule,
      ArticleModule,
      PopularSelectionsModule,
      UserSettings,
      PdfDataModule,
      SearchModule,
      Tabs,
      Objects,
      CollaborationModule,
      NomenclatureModule,
      NotificationModule,
    },
  })
}

export default createStore
