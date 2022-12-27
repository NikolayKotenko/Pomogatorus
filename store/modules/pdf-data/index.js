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

      let filter_id_tag = '';
      if (ids_tags){
        ids_tags.forEach((id_tag) => { filter_id_tag += '&filter[id_tag][]='+id_tag })
      }
      let query = '?filter[id_user]='+this.state.AuthModule.userData.id;
      query += filter_id_tag;

      const response = await Request.get(this.state.BASE_URL + '/entity/pdf-user-report'+query)
      console.log('response', response)
      commit('set_report_data', response.data)

      return response;
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
        margin: [10, 20, 10, 20], //top, left, buttom, right
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
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
        }
      }
    },
  },
}
