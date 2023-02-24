import Request from '@/services/request'

export default {
  namespaced: true,
  state: {
    isLoading: false,
    isLoadingData: false,
    tabs: [],
    tabData: [],
    inputTypes: [],
  },
  mutations: {
    setLoading(state, payload) {
      state.isLoading = payload
    },
    setTabs(state, payload) {
      state.tabs = payload
    },
    setLoadingData(state, payload) {
      state.isLoadingData = payload
    },
    setTabData(state, payload) {
      let result

      if (payload && payload.length) {
        payload.forEach((item) => {
          let tabData = Object.assign(item, { active: false })
          result.push(tabData)
        })
      } else {
        result = []
      }

      state.tabData = result
    },
    setInputTypes(state, payload) {
      state.inputTypes = payload
    },
  },
  actions: {
    async getTabs({ commit }) {
      commit('setLoading', true)

      const { data } = await Request.get(this.state.BASE_URL + '/dictionary/tags?filter[flag_engineering_system]=true')
      commit('setTabs', data)

      commit('setLoading', false)
    },
    async getTabInfo({ commit }, payload) {
      commit('setLoadingData', true)

      const { data } = await Request.get(
        this.state.BASE_URL +
          `/dictionary/object-properties?filter%5Bcodes_properties%5D%5B%5D=${payload}&sort%5Bsort%5D=asc`
      )
      commit('setTabData', data)

      commit('setLoadingData', false)
    },
    async getInputTypes({ commit }) {
      const { data } = await Request.get(this.state.BASE_URL + `/dictionary/property-object`)
      commit('setInputTypes', data)
    },
  },
  getters: {},
}
