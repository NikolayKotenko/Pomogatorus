import Request from '@/services/request'
import constructFilterQuery from '@/utils/constructFilterQuery'

export default {
  namespaced: true,
  state: {
    isLoading: false,
    isLoadingObjects: true,
    listObjects: [],
    currentObject: {},
    modalCurrentObject: {},
    loading_objects: false,
  },
  mutations: {
    setLoading(state, payload) {
      state.isLoading = payload
    },
    setLoadingObjects(state, payload) {
      state.isLoadingObjects = payload
    },
    setListObjects(state, payload) {
      state.listObjects = []
      state.listObjects = payload
    },
    clearListObjects(state) {
      state.listObjects = []
    },
    set_currentObject(state, value) {
      if (!value) return false

      state.currentObject = value
    },
    change_loaderObjects(state, value) {
      state.loading_objects = value
    },
  },
  actions: {
    onloadSetCurrentUserObject({ commit, state }) {
      let currentObj = null

      //Берем у которого на бэке состояние тру
      currentObj = state.listObjects.filter((obj) => {
        return obj.m_to_m_users_objects.state_current_object === true
      })[0]
      //Если такого нет ни одного то берем первый попавшийся по сортировке
      if (!currentObj) {
        currentObj = state.listObjects[0]
      }

      commit('set_currentObject', currentObj)
    },
    // TODO: Когда появится новый "Безопасный" метод заменить на него по токену
    async getListObjectsByUserId({ commit, dispatch }, idUser) {
      const query = constructFilterQuery({
        id_user: idUser ? idUser : null,
      })

      const response = await Request.get(
        this.state.BASE_URL + `/entity/objects${query}&sort[updated_at]=desc`
      )
      commit('setListObjects', response.data)
      dispatch('onloadSetCurrentUserObject')

      commit('setLoadingObjects', false)

      return response
    },
    async saveObjData({ commit }, payload) {
      commit('setLoading', true)

      const { id, keys } = payload

      await Request.put(this.state.BASE_URL + `/entity/objects/${id}`, keys)

      commit('setLoading', false)
    },
    clearListObjects({ commit }) {
      commit('clearListObjects')
    },
    async createNewObject({ commit, dispatch, rootState }, payload) {
      commit('change_loaderObjects', true)

      const { data } = await Request.post(
        this.state.BASE_URL + '/entity/objects',
        {
          address: payload.newObjAddress,
          name: payload.name,
        }
      )

      await dispatch('loginByToken', null, { root: true })

      if (rootState.AuthModule.userData.objects.length === 1) {
        await dispatch('setCurrentObject', data)
      }

      commit('change_loaderObjects', false)

      return data
    },
    /* На бэке скрипт обнуляет state_current_object по текущему пользователю
       и выставляет объект который передаем
     */
    async setCurrentObject({ commit, state }, object) {
      const response = await Request.put(
        this.state.BASE_URL +
          `/m-to-m/set-current-object/${object.m_to_m_users_objects.id}`,
        object.m_to_m_users_objects
      )
      commit('set_currentObject', object)
      return response
    },
  },
  getters: {
    stateObjectSelected(state) {
      return Boolean(Object.keys(state.currentObject).length)
    },
    stateFilledListObjects(state) {
      return Boolean(state.listObjects.length)
    },
  },
}
