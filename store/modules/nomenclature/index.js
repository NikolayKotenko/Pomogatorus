import Request from '@/services/request'
export default {
  namespaced: true,
  state: {
    listNomenclature: [],
    listFavoriteNomenclature: [],
  },
  mutations: {
    set_list_nomenclature(state, payload) {
      if (payload.paginationData.onFirstPage) {
      state.listNomenclature = []
      state.listNomenclature = payload.data
      } else {
        state.listNomenclature = payload.data;
      }
    },
    set_list_favorite_nomenclature(state, payload) {
      state.listFavoriteNomenclature = []
      state.listFavoriteNomenclature = payload
    },
  },
  actions: {
    async getListNomenclature({ commit }, query = '') {
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
    async getListFavoriteNomenclatureByUserAndObjectId({ commit, rootGetters }) {
      const response = await Request.get(
        this.state.BASE_URL + '/m-to-m/favorites-nomenclature', {
          id_object: rootGetters['Objects/getIdCurrentObject'],
          id_user: rootGetters.getUserId
        }
      )

      commit('set_list_favorite_nomenclature', response.data)

      return response
    },
    async setFavoritesNomenclatureByObject({ rootGetters, state, commit, dispatch }, productId) {
      await Request.post(
        this.state.BASE_URL + '/m-to-m/favorites-nomenclature/add', {
          id_object: rootGetters['Objects/getIdCurrentObject'],
          id_user: rootGetters.getUserId,
          id_nomenclature: productId
        },)
      // Вызов диспатча в одном компоненте
      await dispatch('getListFavoriteNomenclatureByUserAndObjectId')
    },
    async deleteOneFavoriteNomenclature({ dispatch, rootGetters }, productId) {
      await Request.delete(
        this.state.BASE_URL + '/m-to-m/favorites-nomenclature/remove', {
          id_object: rootGetters['Objects/getIdCurrentObject'],
          id_user: rootGetters.getUserId,
          id_nomenclature: productId
        },)

      await dispatch('getListFavoriteNomenclatureByUserAndObjectId')
    }

  },
  getters: {
    getCountFavoriteNomenclatures(state) {
      return state.listFavoriteNomenclature.length
    },
  },
}
