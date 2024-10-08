import Request from '@/services/request'
import constructFilterQuery from '@/utils/constructFilterQuery'

export default {
  namespaced: true,
  state: {
    isLoadingObjects: false,
    listObjects: [],
    currentObject: {},
    modalCurrentObject: {},
    objectData: {},
    listObjectFiles: {}
    // stateGlobalObjectModal: false
  },
  mutations: {
    set_modal_current_object(state, payload){
      state.modalCurrentObject = payload
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
      if (!value) value = {}

      state.currentObject = value
    },
    set_object_data(state, payload) {
      state.objectData = payload
    },
    set_list_object_files(state, payload) {
      state.listObjectFiles = payload
    }
    // set_state_global_object_modal(state, payload) {
    //   state.stateGlobalObjectModal = payload
    // }
  },
  actions: {
    // openGlobalObjectModal({ commit }) {
    //   commit('set_state_global_object_modal', true)
    // },
    // closeGlobalObjectModal({ commit }) {
    //   commit('set_state_global_object_modal', false)
    // },
    onloadSetCurrentUserObject({ commit, state }) {
      let currentObj = null

      // Берем у которого на бэке состояние тру
      currentObj = state.listObjects.filter((obj) => {
        return obj.m_to_m_users_objects.state_current_object === true
      })[0]
      // Если такого нет ни одного то берем первый попавшийся по сортировке
      if (!currentObj) {
        currentObj = state.listObjects[0]
      }

      commit('set_currentObject', currentObj)
    },

    // TODO: Когда появится новый "Безопасный" метод заменить на него по токену
    async getListObjectsByUserId(
      { commit, dispatch, getters, rootGetters },
      queryArr = []
    ) {
      if (!rootGetters.getUserId) return false

      commit('setLoadingObjects', true)

      const arrayA = queryArr
      const arrayB = [{ id_user: rootGetters.getUserId }]
      const newArray = arrayA.concat(arrayB)

      const query = constructFilterQuery(newArray)
      const response = await Request.get(
        this.state.BASE_URL + `/entity/objects${query}&sort[updated_at]=desc`
      )
      commit('setListObjects', response.data)
      dispatch('onloadSetCurrentUserObject')

      commit('setLoadingObjects', false)

      return response
    },
    async saveObjData({ commit }, payload) {
      commit('setLoadingObjects', true)

      const { id, keys } = payload

      await Request.put(this.state.BASE_URL + `/entity/objects/${id}`, keys)

      commit('setLoadingObjects', false)
    },
    clearListObjects({ commit }) {
      commit('clearListObjects')
    },
    async createNewObject({ commit, dispatch, rootState }, payload) {
      commit('setLoadingObjects', true)

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

      commit('setLoadingObjects', false)

      return data
    },
    /* На бэке скрипт обнуляет state_current_object по текущему пользователю
       и выставляет объект который передаем
     */
    async setCurrentObject({ commit, state }, object) {
      if (!object) return false

      const response = await Request.put(
        this.state.BASE_URL +
          `/m-to-m/set-current-object/${object.m_to_m_users_objects.id}`,
        object.m_to_m_users_objects
      )
      commit('set_currentObject', object)
      return response
    },
    // async getCurrentObjectData({ commit, state }, objectId) {
    //   const response = await Request.get(
    //     this.state.BASE_URL +
    //     `entity/objects/${objectId}`
    //   )
    //
    //   commit('set_object_data', response.data)
    // }
    async getObjectById({ state, commit }, idObject){
      const response = await Request.get(
        this.state.BASE_URL +
          `/entity/objects/${idObject}`
      )

      commit('set_modal_current_object', response.data)
    },

  },
  getters: {
    stateObjectSelected(state) {
      return Boolean(Object.keys(state.currentObject).length)
    },
    stateFilledListObjects(state) {
      return Boolean(state.listObjects.length)
    },
    getCountObject(state) {
      return state.listObjects.length
    },
    getIdCurrentObject(state) {
      return Object.keys(state.currentObject).length
        ? state.currentObject.id
        : null
    },
    getFirstPhotoObject(state) {
      if (!Object.keys(state.currentObject).length) return {}

      const arrImages = state.currentObject['osnovnoe-foto-obekta']
      if (!arrImages) return {}

      const firstImage = arrImages.filter((item) => {
        return item.main_photo_object === true
      })
      return firstImage ? firstImage[0] : {}
    },
    getPhotosObject(state) {
      return state.modalCurrentObject['osnovnoe-foto-obekta']
    },
    getLastObjectPhoto(state) {
      return state.modalCurrentObject?.main_photo_compile?.url
    },
    getObjectFiles(state) {
      return state.modalCurrentObject.e_client_files
        .filter((file) => file.main_photo_object === false)
        .map((file) => file.filename)
    },

  },
}
