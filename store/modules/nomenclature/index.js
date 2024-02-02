import Request from '@/services/request'

export default {
  namespaced: true,
  state: {
    listNomenclature: [],
  },
  mutations: {
    set_list_nomenclature(state, payload) {
      // if (payload.paginationData.onFirstPage) {
      state.listNomenclature = []
      state.listNomenclature = payload.data
      // } else {
      //   state.listNomenclature.push(payload.data)
      // }
    },
  },
  actions: {
    async getListNomenclature({ commit }, query = '') {
      console.log('getListNomenclature', query)
      // TODO: Дописать Query запрос
      // const query = 'filter[public_field_filter]=true'
      const response = await Request.get(
        this.state.BASE_URL +
          '/entity/nomenclature' +
          Request.ConstructQuery(query)
      )
      commit('set_list_nomenclature', response)
      commit('set_current_pagination_data', response.paginationData, {
        root: true,
      })
      return response
    },
    // async getListNomenclatureCharacteristics({commit}) {
    //   const response = await  Request.get(
    //     this.state.BASE_URL + /
    //   )
    // },
  },
  getters: {},
}
