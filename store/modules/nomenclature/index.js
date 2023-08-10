import Request from '@/services/request'

export default {
  namespaced: true,
  state: {
    listNomenclature: [],
  },
  mutations: {
    set_list_nomenclature(state, payload) {
      state.listNomenclature = []
      state.listNomenclature = payload
    },
  },
  actions: {
    async getListNomenclature({ commit }) {
      // TODO: Дописать Query запрос
      // const query = 'filter[public_field_filter]=true'
      const response = await Request.get(
        this.state.BASE_URL + '/entity/nomenclature'
      )
      commit('set_list_nomenclature', response.data)
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
