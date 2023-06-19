import Request from '@/services/request'

export default {
  namespaced: true,
  state: {
    stateBlock: false,
    isLoading: false,
    listMembers: [],
  },
  mutations: {
    setLoading(state, payload) {
      state.isLoading = payload
    },
    setMembersList(state, payload) {
      state.listMembers = []
      state.listMembers = payload
    },
  },
  actions: {
    async getListMembers({ commit }, Obj) {
      commit('setLoading', true)

      const query = Request.ConstructFilterQuery(Obj)
      // query = ?filter[id_object]=2
      // query = ?filter[searchPhrase]=sdfsdfsdfs

      const response = await Request.get(
        this.state.BASE_URL + '/users/get-list-users' + query
      )
      commit('setMembersList', response.data)
      commit('setLoading', false)
      return response
    },
    async saveObjData({ commit }, payload) {
      commit('setLoading', true)

      const { id, keys } = payload

      await Request.put(this.state.BASE_URL + `/entity/objects/${id}`, keys)

      commit('setLoading', false)
    },
  },
  getters: {
    getFilteredListByRoleExperts(state) {
      return state.listMembers.filter((user) => {
        return user.groups.some((elem) => {
          return elem.code === 'experts'
        })
      })
    },
    getFilteredListByRoleUsers(state) {
      return state.listMembers.filter((user) => {
        return user.groups.some((elem) => {
          return elem.code === 'polzovateli'
        })
      })
    },
  },
}
