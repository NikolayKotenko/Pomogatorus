import Request from '@/services/request'

export default {
  namespaced: true,
  state: {
    stateBlock: false,
    isLoading: false,
    listMembers: [],
    listSearchedMembers: [],
    listInviteIdUsers: [],
    stateCollaborationMenu: false,
  },
  mutations: {
    setLoading(state, payload) {
      state.isLoading = payload
    },
    setMembersList(state, payload) {
      state.listSearchedMembers = [] // обнуляем поиск искомых юзеров
      state.listMembers = []
      state.listMembers = payload
    },
    setSearchedMembersList(state, payload) {
      state.listSearchedMembers = []
      state.listSearchedMembers = payload
    },
    changeStateCollaboration(state, payload) {
      state.stateCollaborationMenu = payload
    },
  },
  actions: {
    // Новый action
    // Отправляем айди пользовтеля и айди текущего объекта, после возвращения результата 200
    // делаем запрос на список пользователей закрепленых
    //
    async setUserByObject({ dispatch }, object) {
      const response = await Request.post(
        this.state.BASE_URL + '/users/invite-user-to-object',
        object
      )

      return response
    },
    async setTaskByObject({ dispatch }, object) {
      const response = await Request.post(
        this.state.BASE_URL + '/entity/request-for-work',
        object
      )

      return response
    },
    async deleteServiceUserByObject({ dispatch, commit }, object) {
      commit('setLoading', true)

      const response = await Request.delete(
        this.state.BASE_URL + '/m-to-m/delete-one-service',
        object
      )
      if (response.codeResponse < 400) {
        await dispatch('getListMembersByFilter', {
          id_object: object.id_object,
        })
      }

      commit('setLoading', false)
      return response
    },
    async getRequestForWorkList() {
      const response = await Request.get(
        this.state.BASE_URL + '/entity/request-for-work/'
      )
      return response
    },
    async getSearchedListMembers({ commit }, string) {
      if (!string) return false

      const response = await Request.get(
        this.state.BASE_URL + '/users/get-list-users/search?q=' + string
      )
      const result = response.data.map((elem) => elem.data) // Преобразуем из поисковой структуры в обычный массив

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
    getFilteredListByRoleUsers(state, getters, rootGetters) {
      return state.listMembers.filter((user) => {
        return user.services_objects.some((elem) => {
          return elem.id === rootGetters.Objects.currentObject.id
        })
      })
    },
  },
}
