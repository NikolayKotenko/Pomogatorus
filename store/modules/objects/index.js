import Request from '@/services/request'
import constructFilterQuery from '@/utils/constructFilterQuery'

export default {
  namespaced: true,
  state: {
    isLoading: false,
    isLoadingObjects: false,
    listObjects: [],
  },
  mutations: {
    setLoading(state, payload) {
      state.isLoading = payload
    },
    setLoadingObjects(state, payload) {
      state.isLoadingObjects = payload
    },
    listObjects(state, payload) {
      state.listObjects = payload
    },
  },
  actions: {
    // TODO: Когда появится новый "Безопасный" метод заменить на него по токену
    async getUserObjects({ commit }, payload) {
      commit('setLoadingObjects', true)

      const query = constructFilterQuery({
        id_user: payload,
      })

      const { data } = await Request.get(this.state.BASE_URL + `/entity/objects${query}`)
      commit('listObjects', data)

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
