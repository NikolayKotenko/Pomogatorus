import Request from '@/services/request'

export default {
  state: {
    isUpdating: false,
  },
  mutations: {
    setIsUpdating(state, payload) {
      state.isUpdating = payload
    },
  },
  actions: {
    async updateUser({ commit }, payload) {
      const { userId, data } = payload

      commit('setIsUpdating', true)

      await Request.post(`${this.state.BASE_URL}/users/set-user-data/${userId}`, { ...data })
        .then((response) => {
          commit('set_default_user_data', response.data, { root: true })
        })
        .finally(() => {
          commit('setIsUpdating', false)
        })
    },
  },
}
