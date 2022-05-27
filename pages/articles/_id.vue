<template>
  <div class="article-template">
    <div
      class="article-template__subHeader"
      :class="[
        {showArticleHeader: isShowTitle},
        {subHeader: ($store.state.show_header && isShowTitle) && $device.isDesktop},
        {subHeaderMobile: $device.isMobile}
      ]"
    >
      <h2>{{ article.name }}</h2>
    </div>
    <div class="article-template__header" ref="nav">
      <Author/>
      <h1 class="article-template__header__title">
        {{ article.name }}
      </h1>
      <div class="tags">
        <v-chip color="green" outlined small>
          Полезно
        </v-chip>
        <v-chip color="green" outlined small>
          Котел
        </v-chip>
        <v-chip color="green" outlined small>
          Другой тэг
        </v-chip>
      </div>
    </div>
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
import Author from "../../components/Article/Author";

export default {
  name: "_id.vue",
  components: {Author},
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
    coordYNav: null,
    heightNav: 70,
  }),
  created() {
  },
  mounted() {
    this.$store.commit('change_breadcrumbs', [
      { text: 'Главная', disabled: false, link: true, exact: true, nuxt: true, replace: true, to: '/' },
      { text: 'Статьи', disabled: false, link: true, exact: true, nuxt: true, replace: true, to: '/articles' },
      { text: `${this.article.name}`, disabled: true, link: true, exact: true, nuxt: true, replace: true, to: '' }
    ])
    if (process.client) {
      window.addEventListener('scroll', this.scrollWindow)
    }
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
    },
    isShowTitle() {
      return this.coordYNav <= 0 && this.coordYNav !== null
    },
  },
  methods: {
    scrollWindow() {
      setTimeout(() => {
        if (this.$refs.nav) {
          //@ts-ignore
          this.coordYNav = this.$refs.nav.getBoundingClientRect().y
          //@ts-ignore
          this.heightNav = this.$refs.nav.getBoundingClientRect().height
        }
      }, 1000)
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

          setTimeout(() => {
            if (this.$route.hash) {
              const elem = document.getElementById(this.$route.hash.split('#').pop())
              const top = window.scrollY + elem.getBoundingClientRect().top;
              window.scrollTo(0, top);
            }
          }, 200)

        })
      }
    },
    checkTypeComponent(elem) {
      console.log(elem.component.name)
      this.params_of_component.name = elem.component.name
      if (elem.component.name === 'questions') {
        const name = Object.prototype.hasOwnProperty.call(elem.component, 'index_question') ? 'question' : elem.component.name
        this.$store.commit('M_count_of_questions', elem.component[`index_${name}`])
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
  },
  destroyed() {
    if (process.client) {
      //@ts-ignore
      window.removeEventListener('scroll', this.scrollWindow)
    }
  },
}
</script>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}

.article-template {
  margin: 0 auto;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  &__subHeader {
    transition: all 0.4s ease-in-out;
    box-shadow: 0px 7px 10px 2px rgba(34, 60, 80, 0.2);
    padding: 10px;
    position: fixed;
    top: -40px;
    opacity: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: -1;
    background: #f3f3f3;
    max-width: 1140px;
    width: 100%;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
  }
  &__header {
    &__title {
      margin: 10px 0 10px 0;
    }
  }
}
.showArticleHeader {
  opacity: 1;
  top: 0;
  z-index: 404;
}
.subHeader {
  top: 64px;
}
.subHeaderMobile {
  top: 56px;
  h2 {
    font-size: 1.1em;
  }
}
.tags {
  margin-bottom: 15px;
}
</style>
