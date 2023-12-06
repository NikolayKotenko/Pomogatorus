import _clone from '../../../helpers/deepClone'
import Request from '@/services/request'
import { MtoMUsersServices } from '~/helpers/constructors'

export default {
  namespaced: true,
  state: {
    isUpdating: false,
    listServices: [],
    selectedServices: [],
    selectedRawServices: [],
    selectedRawAdditionalDataServices: [],
    selectedRawServicesBased: [],
    loading: false,
    showDeleteOneServiceModal: false,
    searchServiceByName: '',
    sortListServicesValue: '',
    updatedEntryPrice: null,
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
    seRawServices(state, payload) {
      state.selectedRawServices = payload
      state.selectedRawServicesBased = payload
    },
    seRawAdditionalDataServices(state, payload) {
      state.selectedRawAdditionalDataServices = payload
      state.selectedRawAdditionalDataServices = payload
    },
    setLoading(state, payload) {
      state.loading = payload
    },
    changeStateDeleteServiceModal(state, payload) {
      state.showDeleteOneServiceModal = payload
    },
  },
  actions: {
    async addServicesAction(
      { commit, rootGetters, state },
      obj = new MtoMUsersServices()
    ) {
      const objMToMUsersServices = {
        id_user: rootGetters.getUserId,
        id_services: obj.id_services,
        price: obj.price,
      }
      await Request.post(
        `${this.state.BASE_URL}/m-to-m/users-services`,
        objMToMUsersServices
      )
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
    async getListServices({ commit, rootGetters }) {
      if (!rootGetters.stateAuth) return false

      const response = await Request.get(
        this.state.BASE_URL + '/dictionary/tags?filter[flag_service]=true'
      )
      commit('setListServices', response.data)
    },
    async getUserServices({ commit, state }, idUser) {
      commit('setLoading', true)

      const queryFilter = Request.ConstructFilterQuery({
        id_user: idUser,
        once_entry: true,
        name: state.searchServiceByName,
      })
      const response = await Request.get(
        this.state.BASE_URL +
          `/m-to-m/users-services` +
          queryFilter +
          state.sortListServicesValue
      )
      // console.log('FFFFF', response)
      commit(
        'setMountedServices',
        response.data.map((elem) => elem.service_data)
      )
      commit('seRawServices', response.data)
      commit('seRawAdditionalDataServices', response.additionalData)

      commit('setLoading', false)
    },

    // Нам не нужно обновление записи, нам нужно хранить хронологию изменения цены
    // async updatePriceService({ commit }, payload) {
    //   const { id } = payload
    //
    //   console.log('updatePriceService payload', payload)
    //
    //   const response = await Request.put(
    //     this.state.BASE_URL + `/m-to-m/users-services/${id}`,
    //     payload
    //   )
    //   console.log('updatePriceService res', response)
    // },

    async deleteEntriesServicesByUser({ rootGetters }) {
      const response = await Request.delete(
        `${this.state.BASE_URL}/m-to-m/delete-all-services-by-user/${rootGetters.getUserId}`
      )
    },
    async deleteOneServiceAssignToUser({ commit, rootGetters }, idService) {
      commit('setLoading', true)

      const response = await Request.delete(
        `${this.state.BASE_URL}/m-to-m/delete-one-service-assign-to-user`,
        {
          id_user: rootGetters.getUserId,
          id_services: idService,
        }
      )

      commit('setLoading', false)
    },
  },
  getters: {
    getCountServices(state) {
      return state.selectedServices.length
    },
    getAdditionalDataByIdServices: (state) => (idServices) => {
      const wtf = state.selectedRawAdditionalDataServices.filter(
        (elem) => elem.id_services === idServices
      )
      return wtf
    },
    getFilteredListServicesByName(state) {
      if (!state.searchServiceByName) return state.selectedRawServicesBased

      return state.selectedRawServicesBased.filter((elem) => {
        const haystack = elem.service_data.name.toLowerCase()
        const needle = state.searchServiceByName.toLowerCase()
        return !!haystack.match(needle)
      })
    },
  },
}
