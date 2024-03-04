import Request from '@/services/request'

export default {
  namespaced: true,
  state: {
    listBrands: [],
    listFavoriteBrands: [],
    isLoading: false,
  },
  mutations: {
    setLoading(state, payload) {
      state.isLoading = payload
    },
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
    },
    async addBrandToUser({ commit, rootGetters, state, dispatch }, idBrand) {
      commit('setLoading', true)

      await Request.post(
        this.state.BASE_URL + '/m-to-m/users-brands', {
          id_user: rootGetters.getUserId,
          id_brand: idBrand
        })

      await dispatch('getCurrentUserData', null, { root: true })

      commit('setLoading', false)
    },
    async deleteBrandByUser({ commit, rootGetters, state, dispatch }, idBrand) {
      commit('setLoading', true)

      await Request.delete(
        this.state.BASE_URL +
        '/m-to-m/users-brands', {
          id_brand: idBrand,
          id_user: rootGetters.getUserId
        }
      )

      await dispatch('getCurrentUserData', null, { root: true })

      commit('setLoading', false)
    }
  },
  getters: {
    // getListBrandsExcludeAdded(state, rootState) {
    //   console.log('arrA', state.listBrands.map((elem) => elem.id))
    //   console.log('arrB', rootState.userData.brands.map((elem) => elem.id))
    //
    //   const arrA = state.listBrands.map((elem) => elem.id)
    //   const arrB = rootState.userData.brands.map((elem) => elem.id)
    //   const differenceIds = arrA.filter((x) => !arrB.includes(x))
    //   // console.log('difference', differenceIds)
    //
    //   return state.listBrands.filter((elem) =>
    //     differenceIds.includes(elem.id)
    //   )
    // },
  }
}
