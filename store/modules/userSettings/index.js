import _clone from '../../../helpers/deepClone'
import Request from '@/services/request'
import { MtoMUsersServices } from '~/helpers/constructors'

export default {
  namespaced: true,
  state: {
    isUpdating: false,
    listCities: [
      {
        id: 1627,
        code: 'moskva',
        city: 'Москва',
        country: 'Россия',
        address: 'г Москва',
        region: 'Москва',
        kladr_id: '7700000000000',
        postal_code: '101000',
        timezone: 'UTC+3',
        dregions: {
          id: 77,
          code: 'g-moskva',
          name: 'Москва',
          name_with_type: 'г Москва',
          code_subject: '77',
        },
      },
      {
        id: 2182,
        code: 'celyabinsk',
        city: 'Челябинск',
        country: 'Россия',
        address: 'г Челябинск',
        region: 'Челябинская',
        kladr_id: '7400000100000',
        postal_code: '454000',
        timezone: 'UTC+5',
        dregions: {
          id: 74,
          code: 'celyabinskaya-obl',
          name: 'Челябинская',
          name_with_type: 'Челябинская обл',
          code_subject: '74',
        },
      },
    ],
    selectedServices: [],
    selectedRawServices: [],
    selectedRawAdditionalDataServices: [],
    selectedRawServicesBased: [],
    loading: false,
    searchServiceByName: '',
    sortListServicesValue: '',
    updatedEntryPrice: null,
    debounceTimeout: null,
    selectedRange: 0,
    rangeArea: ['0', '100', '200', '300', '500', '1000'],
    selectedCity: [],
    stateVisibleMenu: false
  },
  mutations: {
    setIsUpdating(state, payload) {
      state.isUpdating = payload
    },
    setListCities(state, payload) {
      state.listCities = []
      state.listCities = payload
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
    setStateVisibleMenu(state, payload) {
      state.stateVisibleMenu = payload
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

    async updateUser({ commit, getters }, payload) {
      const { userId, data } = payload

      if (!userId) return false

      commit('setIsUpdating', true)

      // Добавляем данные по региону, радиусу обслуживания
      if (getters.getIdsSelectedCities.length) {
        data.ids_cities = getters.getIdsSelectedCities
        data.range_area = getters.getRangeSlider
      }
      // console.log('updateUser data', data)

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
    async getUserServices({ commit, state }, idUser) {
      commit('setLoading', true)

      const queryFilter = Request.ConstructFilterQuery({
        id_user: idUser,
        once_entry: true,
        name: state.searchServiceByName,
      })
      const response = await Request.get(
        this.state.BASE_URL +
          '/m-to-m/users-services' +
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
      await Request.delete(
        `${this.state.BASE_URL}/m-to-m/delete-all-services-by-user/${rootGetters.getUserId}`
      )
    },
    async deleteOneServiceAssignToUser({ commit, rootGetters }, idService) {
      commit('setLoading', true)

      await Request.delete(
        `${this.state.BASE_URL}/m-to-m/delete-one-service-assign-to-user`,
        {
          id_user: rootGetters.getUserId,
          id_services: idService,
        }
      )

      commit('setLoading', false)
    },
    getListCitiesBySearch({ commit, state }, string) {
      if (!string) return false
      if (state.listCities.some((elem) => elem.address === string)) return false

      commit('setLoading', true)

      if (state.debounceTimeout) clearTimeout(state.debounceTimeout)
      state.debounceTimeout = setTimeout(async () => {
        const response = await Request.get(
          this.state.BASE_URL + '/dictionary/cities/search?q=' + string
        )
        commit('setListCities', response.data)
        commit('setLoading', false)
      }, 2000)
    },

    /* MapServiceArea */
    localSetChips({ commit, state }, objCity) {
      // console.log('localSetChips objCity', objCity)

      const existEntry = state.selectedCity.find(
        (elem) => elem.id === objCity.id
      )
      if (existEntry) {
        state.selectedCity = state.selectedCity.filter(
          (elem) => elem.id !== objCity.id
        )
      } else {
        state.selectedCity.push(objCity)
      }
      // console.log('localSetChips state.selectedCity', state.selectedCity)
    },
    setSelectedCity({ commit, state }, objCity) {
      if (!objCity) return false
      if (typeof objCity !== 'object') return false

      const existEntry = state.selectedCity.find(
        (elem) => elem.id === objCity.id
      )
      if (existEntry) return false

      state.selectedCity.push(objCity)
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
    getListServicesExcludeAdded(state, getters, rootState) {
      const arrA = rootState.CollaborationModule.listServices.map(
        (elem) => elem.id
      )
      const arrB = state.selectedRawServices.map((elem) => elem.id_services)
      const differenceIds = arrA.filter((x) => !arrB.includes(x))
      // console.log('difference', differenceIds)

      return rootState.CollaborationModule.listServices.filter((elem) =>
        differenceIds.includes(elem.id)
      )
    },
    getIdsSelectedCities(state) {
      if (!state.selectedCity.length) return []
      return state.selectedCity.map((elem) => elem.id)
    },
    getStateSelectedCities(state) {
      return Boolean(state.selectedCity.length)
    },
    getRangeSlider(state) {
      return state.rangeArea[state.selectedRange]
    },
  },
}
