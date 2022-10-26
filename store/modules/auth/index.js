import Request from '@/services/request'
import _clone from '../../../helpers/deepClone'

export default {
  state: {
    userData: {},
    defaultUserData: {},
  },
  mutations: {
    //  AUTH
    set_user_data(state, result) {
      state.userData = {}
      if (!result) return false

      if (result.objects && Object.keys(result.objects).length) {
        result.objects = Object.values(result.objects);
      }
      state.userData = {}
      state.userData = result
    },
    set_default_user_data(state, payload) {
      state.defaultUserData = {}
      state.defaultUserData = payload
    },
  },
  actions: {
    // AUTH
    async refreshTokens({ commit }) {
      const tokensData = await Request.post(window.location.origin + '/api/auth/refresh')
      commit('set_user_data', _clone(tokensData.data?.user_data, 'replace'))
      commit('set_default_user_data', _clone(tokensData.data?.user_data, 'replace'))
      commit('change_changedCookie', true, { root: true })
      return tokensData
    },
    async loginByToken({ commit }) {
      const tokensData = await Request.post(window.location.origin + '/api/auth/validate-auth')
      commit('set_user_data', _clone(tokensData.data?.user_data, 'replace'))
      commit('set_default_user_data', _clone(tokensData.data?.user_data, 'replace'))
      commit('change_changedCookie', true, { root: true })
      return tokensData
    },
    async loginUser({ commit }, objData) {
      const tokensData = await Request.post(window.location.origin + '/api/auth/login', objData)
      commit('set_user_data', _clone(tokensData.data?.user_data, 'replace'))
      commit('set_default_user_data', _clone(tokensData.data?.user_data, 'replace'))
      commit('change_changedCookie', true, { root: true })
      return tokensData
    },
    async sendEmail({ commit }, objData) {
      return await Request.post(this.state.BASE_URL + '/email/send', objData)
    },
    async createUserByEmail(_, objData) {
      return await Request.post(this.state.BASE_URL + '/users/create-from-only-email', objData)
    },
    async resendUserPass(_, objData) {
      return await Request.post(this.state.BASE_URL + '/users/resend-user-pass', objData)
    },
    async createUserFromEmailAndPass(_, objData) {
      //Делаем запрос на создание пользователя, если такой есть то будет 409 конфликт ошибка ну и бог с ней
      return await Request.post(this.state.BASE_URL + '/users/create-from-full-credentials', objData)
    },
    async logout({ commit }) {
      await Request.post(window.location.origin + '/api/auth/logout').then((response) => {
        commit('set_user_data', {})
        commit('set_default_user_data', {})
      })
    },
  },
  getters: {
    stateAuth(state) {
      return state.userData && Object.keys(state.userData).length !== 0
    },
    checkAdminPanel() {
      if (!process.env.VUE_APP_SERVER) return false

      return Boolean(process.env.VUE_APP_SERVER.match('admin'))
    },
  },
}
