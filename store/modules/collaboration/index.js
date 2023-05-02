import Request from '@/services/request'

export default {
  namespaced: true,
  state: {
    stateBlock: false,
    isLoading: false,
    listUsers: [],
  },
  mutations: {
    setLoading(state, payload) {
      state.isLoading = payload
    },
    setList(state, payload) {
      state.listUsers = payload
    },
  },
  actions: {
    async saveObjData({ commit }, payload) {
      commit('setLoading', true)

      const { id, keys } = payload

      await Request.put(this.state.BASE_URL + `/entity/objects/${id}`, keys)

      commit('setLoading', false)
    },
  },
  getters: {},
}
