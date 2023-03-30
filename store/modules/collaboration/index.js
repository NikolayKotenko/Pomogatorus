import Request from '@/services/request'
import constructFilterQuery from '@/utils/constructFilterQuery'

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
    async getUserObjects({ commit }, payload) {
      commit('setLoadingObjects', true)

      const query = constructFilterQuery({
        id_user: payload,
      })

      const { data } = await Request.get(this.state.BASE_URL + `/entity/objects${query}`)
      commit('setList', data)

      commit('setLoadingObjects', false)
    },
    async saveObjData({ commit }, payload) {
      commit('setLoading', true)

      const { id, keys } = payload

      await Request.put(this.state.BASE_URL + `/entity/objects/${id}`, keys)

      commit('setLoading', false)
    },
  },
  getters: {},
}
