import Request from '@/services/request'

export default {
  namespaced: true,
  state: {
    stateBlock: false,
    isLoading: false,
    listMembers: [],
    listSearchedMembers: [],
  },
  mutations: {
    setLoading(state, payload) {
      state.isLoading = payload
    },
    setMembersList(state, payload) {
      state.listSearchedMembers = [] //обнуляем поиск искомых юзеров
      state.listMembers = []
      state.listMembers = payload
    },
    setSearchedMembersList(state, payload) {
      state.listSearchedMembers = []
      state.listSearchedMembers = payload
    },
  },
  actions: {
    async getSearchedListMembers({ commit }, string) {
      console.log('getSearchedListMembers', string)
      if (!string) return false

      const response = await Request.get(
        this.state.BASE_URL + '/users/get-list-users/search?q=' + string
      )
      const result = response.data.map((elem) => elem.data) //Преобразуем из поисковой структуры в обычный массив

      commit('setSearchedMembersList', result)
      commit('setLoading', false)
      return response
    },
    async getListMembersByFilter({ commit }, Obj) {
      commit('setLoading', true)

      const query = Request.ConstructFilterQuery(Obj) // query = ?filter[id_object]=2
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
