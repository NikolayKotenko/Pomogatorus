import Request from "@/services/request";
import Vue from "vue";

export default {
  state: {
    list_selections: [],
    popular_selections: {},
    loadingState: false,
  },
  mutations: {
    setPopularSelections(state, result) {
      state.popular_selections = {};
      state.popular_selections = result;

      state.loadingState = false;
    },
    setListSelections(state, result){
      state.list_selections = [];
      state.list_selections = result;

      state.loadingState = false;
    },
  },
  actions: {
    async getListSelections({commit}){
      const query = 'filter[public_field_filter]=true';
      const response = await Request.get(this.state.BASE_URL+'/dictionary/tags?'+query)
      commit('setListSelections', response.data)
      return response;
    },
    async getSelections({commit}, code){
      this.state.loadingState = true;

      const response = await Request.get(this.state.BASE_URL+'/entity/popular-selections/'+code)
      console.log('response')
      console.log(response)
      commit('setPopularSelections', response.data)
      commit('M_selectedComponent', response.data.questions[0])
      commit('M_selectedComponent', {})
      commit('M_selectedComponent', response.data.questions[1])
      commit('M_selectedComponent', {})
      return response;
    }
  },
  getters: {
  }
}
