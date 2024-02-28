import Request from '@/services/request'

export default {
  namespaced: true,
  state: {
    listBrands: [],
    listFavoriteBrands: []
  },
  mutations: {
    set_list_brands(state, payload) {
      state.listBrands = []
      state.listBrands = payload
    },
    set_list_favorite_brands(state, payload) {
      state.listFavoriteBrands = []
      state.listFavoriteBrands = payload
    },
  },
  actions: {
    async getListBrands({ commit }) {
      const response = await Request.get(
        this.state.BASE_URL + '/dictionary/brands'
      )

      commit('set_list_brands', response.data)
    }
  },
  getters: {
    getListBrandsExcludeAdded(state) {
      const arrA = state.listBrands.map((elem) => elem.id)
      const arrB = state.listFavoriteBrands.map((elem) => elem.id)
      const differenceIds = arrA.filter((x) => !arrB.includes(x))
      // console.log('difference', differenceIds)

      return state.listBrands.filter((elem) =>
        differenceIds.includes(elem.id)
      )
    },
  }
}
