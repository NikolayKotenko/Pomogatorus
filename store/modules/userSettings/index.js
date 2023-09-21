import _clone from '../../../helpers/deepClone'
import Request from '@/services/request'

export default {
  namespaced: true,
  state: {
    isUpdating: false,
    listServices: [],
    selectedServices: [],
  },
  mutations: {
    setIsUpdating(state, payload) {
      state.isUpdating = payload
    },
    setListServices(state, payload) {
      state.listServices = []
      state.listServices = payload
    },
    addServices(state, payload) {
      state.selectedServices.push(payload)
    },
    setMountedServices(state, payload) {
      state.selectedServices = payload
    },
  },
  actions: {
    addServicesAction({ commit, state }, payload) {
      const checkExist = state.selectedServices.some((elem) => {
        return elem.id === payload.id
      })
      if (checkExist) return true

      commit('addServices', payload)
      return false
    },

    async updateUser({ commit }, payload) {
      const { userId, data } = payload

      if (!userId) return false

      commit('setIsUpdating', true)

      await Request.put(
        `${this.state.BASE_URL}/users/update-user-data/${userId}`,
        { ...data }
      )
        .then((response) => {
          commit('set_user_data', response.data, { root: true })
          commit('set_default_user_data', _clone(response.data, 'replace'), {
            root: true,
          })
        })
        .finally(() => {
          commit('setIsUpdating', false)
        })
    },
    async getListServices({ commit }) {
      const response = await Request.get(
        this.state.BASE_URL + '/dictionary/tags?filter[flag_service]=true'
      )
      commit('setListServices', response.data)
    },
    async getUserServices({ commit }, payload) {
      const response = await Request.get(
        this.state.BASE_URL +
          `/m-to-m/users-services?filter[id_user]=${payload}`
      )
      if (response.data.length) {
        commit(
          'setMountedServices',
          response.data.map((elem) => elem._services)
        )
      }
    },

    async deleteEntriesServicesByUser({ rootGetters }) {
      const response = await Request.delete(
        `${this.state.BASE_URL}/m-to-m/delete-all-services-by-user/${rootGetters.getUserId}`
      )
    },
    async setTetherUsersServices({ commit, rootGetters }, arr) {
      for (const obj of arr) {
        const objMToMUsersServices = {
          id_user: rootGetters.getUserId,
          id_services: obj.id,
        }
        const response = await Request.post(
          `${this.state.BASE_URL}/m-to-m/users-services`,
          objMToMUsersServices
        )
      }
    },
  },
  getters: {
    getCountServices(state) {
      return state.selectedServices.length
    },
  },
}
