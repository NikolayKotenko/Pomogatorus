import Request from '../../../services/request'
import { TaskData , Service , ServiceDataConstructor } from '../../../helpers/constructors'

export default {
  namespaced: true,
  state: {
    taskData: new TaskData(),
    listRatedUsers: [],
  },
  mutations: {
    setTaskData(state, payload) {
      state.taskData = new TaskData()
      state.taskData = payload
    },
    setListRatedUsers(state, payload) {
      state.listRatedUsers = []
      state.listRatedUsers = payload
    },
  },
  actions: {
    async addService({ state, commit, dispatch }, service) {
      state.taskData.services.push(new Service(
        service.id,
        [],
        '',
        1,
        new ServiceDataConstructor(
          service.code,
          service.name,
          service.description
        )
      ))

      await dispatch('getListRatedUsers')
    },
    async getListRatedUsers({ commit, rootGetters }, servicesCodeArray) {
      const queryFilter = Request.ConstructFilterQuery({
        id_object: rootGetters['Objects/getIdCurrentObject'],
        services: servicesCodeArray,
      })

      const response = await Request.get(
        this.state.BASE_URL + '/users/get-list-rated-users' + queryFilter
      )

      commit('setListRatedUsers', response.data)
    },
  },
  getters: {
    getServicesCodes(state) {
      return state.taskData.services.map((item) => item.service_data.code);
    },
  },
}
