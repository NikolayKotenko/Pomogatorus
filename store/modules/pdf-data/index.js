import Request from '@/services/request'

export default {
  namespaced: true,
  state: {
    debounceTimeout: null,
    report_data: {},
  },
  mutations: {
    set_report_data(state, payload) {
      state.report_data = {}
      state.report_data = payload
    },
  },
  actions: {
    async getBodyData({commit, state}, {ids_tags}){
      if (state.debounceTimeout) clearTimeout(state.debounceTimeout)
      state.debounceTimeout = setTimeout(async () => {

        let filter_id_tag = '';
        if (ids_tags){
          ids_tags.forEach((id_tag) => { filter_id_tag += '&filter[id_tag][]='+id_tag })
        }
        let query = '?filter[id_user]='+this.state.AuthModule.userData.id;
        query += filter_id_tag;

        let {data} = await Request.get(this.state.BASE_URL + '/entity/pdf-user-report'+query)
        console.log('data', data)
        commit('set_report_data', data)
      }, 1000)
    }
  },
  getters: {
    headers(state) {
      return [
        {
          text: '№',
          align: 'start',
          value: 'name',
        },
        {text: 'Вопрос', value: 'calories'},
        {text: 'Ответ', value: 'fat'},
      ];
    },
    bodyData(state) {
      return [];
    },
    htmlToPdfOptions: (state) => (filename) => {
      return{
        margin: 0,
        filename: filename+`.pdf`,
        image: {
          type: 'jpeg',
          quality: 0.98
        },
        enableLinks: false,
        html2canvas: {
          scale: 1,
          useCORS: true
        },
        jsPDF: {
          unit: 'in',
          format: 'a4',
          orientation: 'portrait'
        }
      }
    },
  },
}