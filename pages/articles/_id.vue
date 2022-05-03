<template>
  <div class="article-template">
    <h1 class="article-template__title">
      {{ article.name }}
    </h1>
    <div class="article-template__content" v-html="refactored_content">
    </div>
  </div>
</template>

<script>
import Vue from "vue";
// import vuetify from "../../plugins/vuetify";
// import createStore from '../../store/index.js'
// import {VIcon, VTextField, VToolTip, VTextArea} from 'vuetify/lib'

import ImageLayout from "../../components/frontLayouts/ImageLayout";
import Question from "../../components/frontLayouts/Question";
import LoginAuth from "../../components/frontLayouts/LoginAuth";

export default {
  name: "_id.vue",
  async asyncData({$axios, store, params}) {
    const options = {
      method: 'GET',
      url: `${store.state.BASE_URL}/entity/articles/${params.id}`,
      headers: {
        Authorization: '666777'
      },
    }
    try {
      const article_request = await $axios(options)
      console.log(article_request.data.data)
      const article = article_request.data.data
      return {article}
    } catch (error) {
      console.log(error.response.data.message)
    }

  },
  data: () => ({
    params_of_component: {
      name: '',
    },
    data_of_components: [],
  }),
  mounted() {
    /*if (JSON.parse(JSON.parse(JSON.parse(this.article.inserted_components))).length) {
      const arr_of_components = JSON.parse(JSON.parse(JSON.parse(this.article.inserted_components)))
      const promises = []

      arr_of_components.forEach(elem => {
        if (elem.component.name === 'questions') {
          promises.push(this.$store.dispatch('getComponentsById', elem))
        } else if (elem.component.name === 'image') {
          promises.push(this.$store.dispatch('imageFromServer', elem))
        } else if (elem.component.name === 'auth') {
          promises.push(this.$store.dispatch('getAuth', elem))
        }
      })

      Promise.all(promises).finally(() => {
        const arr = []
        this.$store.state.components_after_request.forEach(elem => {
          arr.push(elem)
        })
        arr.sort((a,b) => {
          return a.index - b.index
        })

        this.$nextTick(() => {
          arr.forEach((elem) => {
            setTimeout(() => {
              this.checkTypeComponent(elem)
              let data = {}
              if (elem.component.name === 'image') {
                const full_url = document.getElementById(`component_wrapper-${elem.index}`).getElementsByClassName( 'inserted_image' )[0].src
                let sub_url = full_url.split('.com')
                const alt = document.getElementById(`component_wrapper-${elem.index}`).getElementsByClassName( 'inserted_image' )[0].alt
                data = Object.assign({}, {name: alt}, {full_path: sub_url[1]})
              } else data = elem.data

              this.$store.commit('M_countLayout', elem.index)
              this.$store.commit('M_selectedComponent', data)
              const countLayout = this.$store.state.countLayout
              let range = document.createRange();
              range.selectNode(document.getElementById(`component_wrapper-${elem.index}`));
              range.deleteContents()
              range.collapse(false);
              console.log(this.data_of_components)
              console.log(countLayout)
              this.data_of_components.push(this.getStructureForInstance(elem.component))
              console.log(this.data_of_components[countLayout - 1].instance)
              this.data_of_components[countLayout - 1].instance.$mount() // pass nothing
              range.insertNode(this.data_of_components[elem.index-1].instance.$el)
              this.$store.commit('M_selectedComponent', {})
            })
          })
        })
      })
    }*/
  },
  computed: {
    refactored_content() {
      return JSON.parse(JSON.parse(this.article.content))
    },
    componentLayout() {
      return this.params_of_component.name === 'questions' ? Vue.extend(Question) : this.params_of_component.name === 'image' ? Vue.extend(ImageLayout) : Vue.extend(LoginAuth)
    }
  },
  methods: {
    checkTypeComponent(elem) {
      this.params_of_component.name = elem.component.name
      if (elem.component.name === 'questions') {
        this.$store.commit('M_count_of_questions', elem.component.index_question)
      }
    },
    getStructureForInstance(data_component) {
      // console.log(this.$vuetify)
      // const vuetify = this.$vuetify
      const store = this.$store
      const instance = new this.componentLayout({
        store,
        // vuetify,
      })
      const data = new this.Imported_component({index: this.$store.state.countLayout, component: data_component})
      const params = Object.assign({}, {instance: instance}, {data: data})
      return new this.Constructor_instance(params)
    },

    /* CONSTRUCTORS */
    Imported_component(data) {
      const {index, component} = data

      this.index = index
      this.component = component
    },
    Constructor_instance(params) {
      const {data, instance} = params

      this.data = data
      this.instance = instance
    },
  }
}
</script>

<style lang="scss" scoped>
.article-template {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  &__title {
    width: 100%;
    text-align: center;
  }
}
</style>
