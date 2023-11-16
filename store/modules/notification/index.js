import Request from  '@/services/request'

export default {
  namespaced: true,
  state: {
    listTasks: [],
    listUsers: [],
    loading: true
  },
  mutations: {
    set_list_tasks(state, payload) {
      state.listTasks = []
      state.listTasks = payload
    },
    set_list_users(state, payload) {
      state.listUsers = []
      state.listUsers = payload
    },
    change_loading(state, payload) {
      state.loading = payload
    }
  },
  actions: {
    async getListTasks({ commit }) {

      const response = await Request.get(
        this.state.BASE_URL + '/entity/request-for-work'
      )
      commit('set_list_tasks', response.data)

      return response
    },
    async getListUsers({ commit }, idsUsers = []) {
      commit('change_loading', true)

      const arrUsers = [];
      for (const id of idsUsers) {
        const response = await Request.get(
          this.state.BASE_URL + '/users/get-user-data/'+id
        )
        arrUsers.push(response.data)
      }
      commit('set_list_users', arrUsers)

      commit('change_loading', false)
    },
  },
  getters: {
    getCountTasks(state) {
      return state.listTasks.length
    },

    getListTasksByToday(state) {
      const date = new Date(Date.now()).toLocaleString().split(',')[0]

      return state.listTasks.filter((obj) =>
        obj.created_at_date === date)
    },
    getListTasksByYesterday(state, getters) {
      const date = getters.getDateMinusOneDay;

      const date2 = date.toLocaleDateString().split(',')[0]

      return state.listTasks.filter((obj) =>
        obj.created_at_date === date2)
    },
    getListTasksByWeek(state, getters) {
      const date = getters.getDateMinusWeek;

      return state.listTasks.filter((obj) => {

        const prepareDate = obj.created_at_date.split('.')

        const constrDate = new Date(prepareDate[2], prepareDate[1] - 1, prepareDate[0])

        return (constrDate >= date) && (constrDate < getters.getDateMinusTwoDays)
      })
    },
    getListTasksByMonth(state, getters) {
      const date = getters.getDateMinusMonth;

      return state.listTasks.filter((obj) => {

        const prepareDate = obj.created_at_date.split('.')

        const constrDate = new Date(prepareDate[2], prepareDate[1] - 1, prepareDate[0])

        return (constrDate >= date) && (constrDate < getters.getDateMinusWeek)
      })
    },

    getDateMinusOneDay(){
      return new Date(new Date().setDate(new Date().getDate() - 1));
    },
    getDateMinusTwoDays(){
      return new Date(new Date().setDate(new Date().getDate() - 2));
    },
    getDateMinusWeek(){
      return new Date(new Date().setDate(new Date().getDate() - 7));
    },
    getDateMinusMonth(){
      return new Date(new Date().setDate(new Date().getDate() - 30));
    },
  },
}
