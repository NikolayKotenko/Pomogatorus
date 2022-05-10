<template>
  <div class="article-template">
    <h1 class="article-template__title">
      {{ article.name }}
    </h1>
    <div class="article-template__content" v-html="refactored_content" v-if="!$store.state.refactoring_content">
    </div>
    <v-progress-circular
      v-else
      :size="50"
      color="primary"
      indeterminate
      style="margin-top: 20px"
    ></v-progress-circular>
  </div>
</template>

<script>
import Vue from "vue";
const vuetify_class = require("vuetify")

import ImageLayout from "../../components/frontLayouts/ImageLayout";
import Question from "../../components/frontLayouts/Question";
import LoginAuth from "../../components/frontLayouts/LoginAuth";
import Request from "@/services/request";

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
    if (!this.$store.state.refactoring_content) {
      this.initializeContent()
    }
  },
  watch: {
    '$store.state.refactoring_content': {
      handler(v) {
        if (!v) {
          this.initializeContent()
        }
      }
    }
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
    findPos(obj) {
      let curtop = 0;
      if (obj.offsetParent) {
        do {
          curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return [curtop];
      }
    },
    initializeContent() {
      if (JSON.parse(JSON.parse(JSON.parse(this.article.inserted_components))).length) {
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
                  this.$store.commit('M_selectedComponent', {})
                  // return
                } else data = elem.data

                this.$store.commit('M_countLayout', elem.index)
                this.$store.commit('M_selectedComponent', data)
                const countLayout = this.$store.state.countLayout
                let range = document.createRange();
                range.selectNode(document.getElementById(`component_wrapper-${elem.index}`));
                range.deleteContents()
                range.collapse(false);
                this.data_of_components.push(this.getStructureForInstance(elem.component))
                this.data_of_components[countLayout - 1].instance.$mount() // pass nothing
                range.insertNode(this.data_of_components[elem.index-1].instance.$el)
                this.$store.commit('M_selectedComponent', {})
              })
            })
            this.$store.commit('change_refactoring_content', false)
          })

          if (this.$route.hash) {
            // const element = document.getElementById(this.$route.hash.split('#').pop());
            // const y = element.getBoundingClientRect().top + window.scrollY;
            // window.scroll({
            //   top: y,
            //   behavior: 'smooth'
            // });
            // console.log(this.findPos(document.getElementById(this.$route.hash.split('#').pop())))
            window.scroll(0,this.findPos(document.getElementById(this.$route.hash.split('#').pop())));
            // const elem = document.getElementById(this.$route.hash.split('#').pop());
            // console.log(elem)
            // if (elem) elem.scrollIntoView(true)
          }
        })
      }
    },
    checkTypeComponent(elem) {
      this.params_of_component.name = elem.component.name
      if (elem.component.name === 'questions') {
        this.$store.commit('M_count_of_questions', elem.component.index_question)
      }
    },
    getStructureForInstance(data_component) {
      Vue.use(vuetify_class)
      const vuetify = new vuetify_class
      const store = this.$store
      const instance = new this.componentLayout({
        store,
        vuetify,
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

    callGovnaSobachki(){
      Request.get('https://api.agregatorus.com/dictionary/cities')
    },
    async requestTest(){
      const war = await this.$store.dispatch('refreshTokens')
      console.log('war', war)
    }
  },
  beforeDestroy() {
    this.$store.state.selectedComponent = {}
    this.$store.state.countLayout = 0
    this.$store.state.count_of_questions = 0
    this.$store.state.components_after_request = []
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
