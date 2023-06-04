import Request from '@/services/request'

export default {
  namespaced: true,
  state: {
    stateBlock: false,
    isLoading: false,
    listSearchedUsers: [],
    listTetheredUsers: [],
  },
  mutations: {
    setLoading(state, payload) {
      state.isLoading = payload
    },
    setSearchedListUsers(state, payload) {
      state.listSearchedUsers = []
      state.listSearchedUsers = payload
    },
    setTetheredListUsers(state, payload) {
      state.listTetheredUsers = []
      state.listTetheredUsers = payload
    },
  },
  actions: {
    async getListTetheredUsers({ commit }, idObject) {
      commit('setLoading', true)

      const response = await Request.get(
        this.state.BASE_URL +
          '/users/get-list-users?filter[id_object]=' +
          idObject
      )
      commit('setTetheredListUsers', response.data)
      commit('setLoading', false)
      return response
    },
    async getListSearchedUsers({ commit }, searchPhrase) {
      commit('setLoading', true)

      const response = await Request.get(
        this.state.BASE_URL +
          '/users/get-list-users?filter[searchPhrase]=' +
          searchPhrase
      )
      commit('setSearchedListUsers', response.data)
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
      return state.listTetheredUsers.filter((user) => {
        return user.groups.some((elem) => {
          return elem.code === 'experts'
        })
      })
    },
    getFilteredListByRoleUsers(state) {
      return state.listTetheredUsers.filter((user) => {
        return user.groups.some((elem) => {
          return elem.code === 'polzovateli'
        })
      })
    },
  },
}
