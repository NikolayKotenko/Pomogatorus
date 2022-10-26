import Request from '@/services/request'
import _clone from '../../../helpers/deepClone'

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

      await Request.put(`${this.state.BASE_URL}/users/update-user-data/${userId}`, { ...data })
        .then((response) => {
          // commit('set_user_data', response.data, { root: true })
          commit('set_default_user_data', _clone(response.data, 'replace'), { root: true })
        })
        .finally(() => {
          commit('setIsUpdating', false)
        })
    },
  },
}
