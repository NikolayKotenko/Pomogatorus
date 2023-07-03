import Request from '@/services/request'
import _clone from '../../../helpers/deepClone'

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
    setSelectedServices(state, payload) {
      state.selectedServices = payload
    },
  },
  actions: {
    async updateUser({ commit, getters }, payload) {
      const { userId, data } = payload

      commit('setIsUpdating', true)

      await Request.put(
        `${this.state.BASE_URL}/users/update-user-data/${userId}`,
        {services: getters.idsServices}, { ...data }
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
    async setSelectedServicesAction({ commit }, obj) {
      commit('setSelectedServices', obj)
    },

    async setTetherUsersServices({ commit, rootGetters }, arr) {

      for (const obj of arr) {
        const objMToMUsersServices = {
          id_user: rootGetters.getUserId,
          id_services: obj.id,
        }
        const responsePost = await Request.post(
          `${this.state.BASE_URL}/m-to-m/users-services`,
          objMToMUsersServices
        )
        console.log('responsePost', responsePost)
        if (responsePost.codeResponse >= 400) {
          const responsePut = await Request.put(
            `${this.state.BASE_URL}/m-to-m/users-services/${responsePost.data.id}`,
            objMToMUsersServices
          )
          console.log('responsePut', responsePut)
        }
      }
    },
  },
  getters:{
    idsServices(state){
      return state.selectedServices.map((elem) => {return elem.id} )
    }
  }
}
