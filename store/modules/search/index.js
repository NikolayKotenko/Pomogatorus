import Request from '@/services/request'


export default {
  state: {

  },
  mutations: {

    set_default_user_data(state, payload) {
      state.defaultUserData = {}
      state.defaultUserData = payload
    },
  },
  actions: {

    async getArticlesBySymbols({ commit }) {
      const tokensData = await Request.post(window.location.origin + '/api/auth/validate-auth')
      commit('set_user_data', _clone(tokensData.data?.user_data, 'replace'))
      commit('set_default_user_data', _clone(tokensData.data?.user_data, 'replace'))
      commit('change_changedCookie', true, { root: true })
      return tokensData
    },
  },
  getters: {
    userIsAgent(state) {
      return Object.keys(state.userData).length ? state.userData.is_agent : false;
    },

  },
}
