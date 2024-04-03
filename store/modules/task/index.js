import Request from '../../../services/request'
import { TaskData , Service , ServiceDataConstructor } from '../../../helpers/constructors'

export default {
  namespaced: true,
  state: {
    taskData: new TaskData(),
    listRatedUsers: [],
    dataUsers: [],
    stateModal: false
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
    setUsersData(state, userData) {
      state.taskData.ids_users.push(userData.id);
      state.dataUsers.push(userData)
    },

  },
  actions: {
    async addService({ state, commit, dispatch }, service) {
      if (!service) return false;

      if (state.taskData.services.find(item => item.id_services === service.id)) {
        this.$toast.error('Такая услуга уже добавлена');
        return false;
      }

      state.taskData.services.push(new Service(
        service.id,
        [],
        '',
        '',
        new ServiceDataConstructor(
          service.code,
          service.name,
          service.description
        )
      ))

      this.$toast.success('Услуга добавлена');
      await dispatch('getListRatedUsers')
    },

    async deleteService({ state, dispatch }, serviceToRemove) {
      state.taskData.services.splice(serviceToRemove, 1)

      await dispatch('getListRatedUsers')
      this.$toast.success('Услуга удалена');
    },

    async getListRatedUsers({ commit, rootGetters, getters }) {
      const queryFilter = Request.ConstructFilterQuery({
        id_object: rootGetters['Objects/getIdCurrentObject'],
        services: getters.getServicesCodes,
      })

      const response = await Request.get(
        this.state.BASE_URL + '/users/get-list-rated-users' + queryFilter
      )

      commit('setListRatedUsers', response.data)
    },

    addUser({ commit, state }, userData) {
      if (state.taskData.ids_users.includes(userData.id)) {
        this.$toast.error('Исполнитель уже добавлен');
        return false;
      }

      commit('setUsersData', userData)

      this.$toast.success('Исполнитель добавлен');
    },

    deleteUser({ state }, idUserToRemove, dataUserToRemove) {
      state.taskData.ids_users.splice(idUserToRemove, 1)
      state.dataUsers.splice(dataUserToRemove, 1)

      this.$toast.success('Исполнитель удален');
    },

    async sendTask({ state }) {
      if (!state.taskData.services.length) {
        this.$toast.info('Выберите услугу');
        return false;
      }

      if (!state.taskData.ids_users.length) {
        this.$toast.info('Добавьте исполнителя');
        return false;
      }


      const response = await Request.post(
        this.state.BASE_URL + '/entity/request-for-work',
        state.taskData
      )

      this.$toast.success(response.message);
    }

  },
  getters: {
    getServicesCodes(state) {
      return state.taskData.services.map((item) => item.service_data.code);
    },
    getCountServices(state) {
      return state.taskData.services.length
    },
    getCountRatedUsers(state) {
      return state.listRatedUsers.length
    },
    getCountAddedUsers(state) {
      return state.taskData.ids_users.length
    },
    getMatchPercentage: (state, getters) => (ratedUserServices) => {
      const taskServicesLength = state.taskData.services.length
      const userServicesCodes = ratedUserServices.map((elem) => elem.code)

      const taskServicesCodes = getters.getServicesCodes

      const resultArr = []

      for (const elem of userServicesCodes) {
        if (taskServicesCodes.includes(elem)) {
          resultArr.push(elem)
        }
      }

      let result = Math.floor((resultArr.length / taskServicesLength) * 100)

      if (result > 100) {
        result = '100%'
      } else {
        result = result + '%'
      }

      return result
    },
    getCountUserServicesToMatch: (state, getters) => (ratedUserServices) =>  {
      const taskServicesLength = state.taskData.services.length
      const userServicesCodes = ratedUserServices.map((elem) => elem.code)

      const taskServicesCodes = getters.getServicesCodes

      const resultArr = []

      for (const elem of userServicesCodes) {
        if (taskServicesCodes.includes(elem)) {
          resultArr.push(elem)
        }
      }

      return resultArr.length + ' из ' + taskServicesLength
    },
    getListServicesOfUserToExecute: (state) => (ratedUserServices) => {
      const userServicesName = ratedUserServices
        .map((elem) => elem.name)

      const taskServicesName = state.taskData.services
        .map((elem) => elem.service_data.name)

      const resultArr = []

      for (const elem of userServicesName) {
        if (taskServicesName.includes(elem)) {
          resultArr.push(elem)
        }
      }

      return resultArr
    },
  },
}
