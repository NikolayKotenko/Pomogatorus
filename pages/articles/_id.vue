<template>
  <div class="article-template">
    <template v-if="article">
      <div
        class="article-template__subHeader"
        :class="[
        {showArticleHeader: isShowTitle},
        {subHeader: ($store.state.show_header && isShowTitle) && $device.isDesktop},
        {subHeaderMobile: $device.isMobile}
      ]"
      >
        <h2 class="mainTitleFont">{{ article.name }}</h2>
      </div>
      <div class="article-template__header" ref="nav">
        <h1 class="article-template__header__title mainTitleFont">
          {{ article.name }}
        </h1>
        <ArticleInfo
          :article_data="article"
        />
      </div>

      <div class="article-template__content mainContentFont" v-html="refactored_content"></div>
    </template>

    <div class="hidden-mask" v-if="$store.state.ArticleModule.refactoring_content || !article"></div>
    <v-overlay :value="$store.state.ArticleModule.refactoring_content">
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
        style="margin-top: 20px"
      ></v-progress-circular>
    </v-overlay>
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

import ArticleInfo from "../../components/Article/ArticleInfo";

export default {
  name: "_id.vue",
  components: {ArticleInfo, Author},
  async asyncData({$axios, store, params}) {
    const options = {
      method: 'GET',
      url: `${store.state.BASE_URL}/entity/articles/${params.id}`,
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
  head() {
    return {
      title: `${this.article.name}`,
      meta: [
        {charset: 'utf-8'},
        {name: 'viewport', content: 'width=device-width,initial-scale=1,viewport-fit=cover,maximum-scale=1'},
        {
          hid: 'keywords',
          name: 'keywords',
          content: `${this.article.seo_keywords}`
        },
        {
          hid: 'description',
          name: 'description',
          content: `${this.article.seo_description}`
        },
        {hid: 'theme-color', name: 'theme-color', content: 'blue'},
      ],
    }
  },
  jsonld() {
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        "name": "Pomogatorus",
        "headline": this.article.preview,
        "image": "",
        "author": {
          "@type": "Organization",
          "name": "Pomogatorus"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Pomogatorus",
          "logo": {
            "@type": "ImageObject",
            "url": ""
          }
        },
        "datePublished": this.article.created_at
      },
    ]
  },
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
    this.initializeContent().then(() => {
      setTimeout(() => {
        this.changeIndexQuestion()
        this.$store.commit('change_refactoring_content', false)
      })
      // SCROLL TO AUTH BLOCK IF WE COME FROM EMAIL MESSAGE
      setTimeout(() => {
        if (this.$route.hash) {
          const elem = document.getElementById(this.$route.hash.split('#').pop())
          const top = window.scrollY + elem.getBoundingClientRect().top - this.heightNav - 54;
          window.scrollTo(0, top);
        }
      }, 200)
    })
  },
  watch: {
    '$store.state.refactoring_content': {
      handler(v) {
        if (!v) {
          this.initializeContent().then(() => {
            this.$store.commit('change_refactoring_content', false)
          })
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
    changeIndexQuestion() {
      let questions = [...document.getElementsByClassName('question_wrapper')]

      this.$nextTick(() => {
        let counter = 1

        questions.forEach(elem => {
          let tmpStr = elem.id.match("-(.*)")
          let id = tmpStr[tmpStr.length-1]

          let component = this.data_of_components.filter(elem => {
            return (elem.data.component.name === 'question' || elem.data.component.name === 'questions')
          }).filter(elem => {
            return (elem.data.index == id)
          })

          const key_data = `index_${component[0].data.component.name}`
          component[0].instance.$data[key_data] = counter

          counter++
        })
      })
    },
    initializeContent() {
      return new Promise((resolve) => {
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
            this.$store.state.ArticleModule.components_after_request.forEach(elem => {
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
                    const title = document.getElementById(`component_wrapper-${elem.index}`).getElementsByClassName( 'inserted_image' )[0].title
                    data = Object.assign({}, {name: alt}, {full_path: sub_url[1]}, {title: title})
                    this.$store.commit('M_selectedComponent', {})
                    // return
                  } else data = elem.data

                  this.$store.commit('M_countLayout', elem.index)
                  this.$store.commit('M_selectedComponent', data)
                  const countLayout = this.$store.state.ArticleModule.countLayout
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
            })
            resolve()
          })
        }
      })
    },
    checkTypeComponent(elem) {
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
      const router = this.$router
      const instance = new this.componentLayout({
        store,
        vuetify,
        router,
      })
      const data = new this.Imported_component({index: this.$store.state.ArticleModule.countLayout, component: data_component})
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
    this.$store.state.ArticleModule.selectedComponent = {}
    this.$store.state.ArticleModule.countLayout = 0
    this.$store.state.ArticleModule.count_of_questions = 0
    this.$store.state.ArticleModule.components_after_request = []
  },
  destroyed() {
    if (process.client) {
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

.hidden-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  background: #FFFFFF;
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
    font-size: 1.5rem !important;
  }
  &__header {
    &__title {
      margin: 10px 0 10px 0;
      padding-bottom: 6px;
      border-bottom: 1px solid darkgrey;
    }
  }
  &__content {
    word-break: normal;
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
</style>
