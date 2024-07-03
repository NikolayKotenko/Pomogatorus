import Request from '@/services/request'
import constructFilterQuery from '@/utils/constructFilterQuery'

export default {
  namespaced: true,
  state: {
    isLoading: false,
    isLoadingData: false,
    tabs: [],
    tabData: [],
    inputTypes: [],
    allTabData: [],
  },
  mutations: {
    setLoading(state, payload) {
      state.isLoading = payload
    },
    setTabs(state, payload) {
      let result = []

      if (payload && payload.length) {
        result = payload
        result.unshift({
          name: 'Всё',
          code: 'all',
        })
      }

      state.tabs = result
    },
    setLoadingData(state, payload) {
      state.isLoadingData = payload
    },
    setTabData(state, payload) {
      const result = []

      if (payload && payload.length) {
        payload.forEach((item) => {
          const tabData = Object.assign(item, { active: false })
          result.push(tabData)
        })
      }

      state.tabData = result
    },
    setAllFields(state, payload) {
      state.allTabData = payload
    },
    setInputTypes(state, payload) {
      state.inputTypes = payload
    },
  },
  actions: {
    async getTabs({ commit }) {
      commit('setLoading', true)

      const { data } = await Request.get(
        this.state.BASE_URL + '/dictionary/tags?filter[flag_engineering_system]=true&sort[sort_engineering_system]=asc'
      )
      commit('setTabs', data)

      commit('setLoading', false)
    },
    async getTabInfo({ commit, state }, payload) {
      commit('setLoadingData', true)

      let queryData = []

      if (payload === 'all') {
        queryData = state.tabs
          .map((tab) => {
            return { codes_tags: tab.code }
          })
          .filter((elem) => elem.codes_tags !== 'all')
      } else {
        queryData = { codes_tags: payload }
      }

      const query = constructFilterQuery(queryData, true)

      const { data } = await Request.get(this.state.BASE_URL + `/dictionary/object-properties${query}&sort[sort]=asc`)
      commit('setTabData', data)
      if (payload === 'all') {
        commit('setAllFields', data)
      }

      commit('setLoadingData', false)
    },
    async getInputTypes({ commit }) {
      const { data } = await Request.get(this.state.BASE_URL + '/dictionary/property-object')
      commit('setInputTypes', data)
    },
    async removeFile({ commit }, payload) {
      await Request.delete(this.state.BASE_URL + `/entity/files/${payload}`)
    },
  },
  getters: {},
}
