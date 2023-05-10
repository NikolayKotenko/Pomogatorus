<template>
  <v-container>
    <div class="article-template">
      <template v-if="article">
        <div ref="nav" class="article-template__header">
          <h1 class="article-template__header__title mainTitleFont">
            <div>{{ article.name }}</div>
          </h1>
          <ArticleInfo :article_data="article" @set-view="setView"/>
          <div v-if="!renderArticle" class="article-template__content mainContentFont" v-html="refactored_content"/>
        </div>
      </template>

      <div v-if="$store.state.ArticleModule.refactoring_content || !article" class="hidden-mask"/>
    </div>


    <div v-if="listArticlesExcludeCurrent.length" class="article_info_wrapper__more_article">
      <h3>
        Ещё статьи по тегу:
        <HashTagStyled :text="getFirstTag"/>
      </h3>
      <div class="article_info_wrapper__more_article__wrapper">
        <ArticleSmallCard
          v-for="(obj, key) in listArticlesExcludeCurrent"
          :key="key"
          :article="obj"
        />
      </div>
    </div>
    <Biathlon v-if="! $store.state.ArticleModule.refactoring_content" :questions="computedQuestions"/>
    <v-overlay :value="$store.state.ArticleModule.refactoring_content" z-index="10">
      <v-progress-circular :size="50" color="primary" indeterminate style="margin-top: 20px"/>
    </v-overlay>

    <!-- TODO: DEPRECATED, Теперь у нас есть боковой виджет объекта -->
    <!--    <footer-summary></footer-summary> -->
  </v-container>
</template>

<script>
import Vue from 'vue'
import ArticleSmallCard from '../../components/Article/ArticleSmallCard.vue'
import Biathlon from '../../components/Common/Biathlon.vue'
import ImageLayout from '~/components/frontLayouts/ImageLayout'
import Question from '~/components/frontLayouts/Question'
import LoginAuth from '~/components/frontLayouts/LoginAuth'
import ArticleInfo from '~/components/Article/ArticleInfo'
import HashTagStyled from '~/components/Common/HashTagStyled'
import Request from '~/services/request'

const VuetifyClass = require('vuetify')

export default {
  name: '_id.vue',
  components: { Biathlon, ArticleSmallCard, ArticleInfo, HashTagStyled },
  async asyncData({ store, params }) {
    try {
      const articleRequest = await Request.get(`${store.state.BASE_URL}/entity/articles/${params.id}`, '', true)
      const article = articleRequest.data
      return { article }
    } catch (error) {
      console.warn(error)
    }
  },
  data: () => ({
    params_of_component: {
      name: ''
    },
    data_of_components: [],
    computedQuestions: [],
    coordYNav: null,
    heightNav: 70,

    renderArticle: false
  }),
  head() {
    return {
      title: `${this.article.name}`,
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width,initial-scale=1,viewport-fit=cover,maximum-scale=1'
        },
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
        {
          hid: 'theme-color',
          name: 'theme-color',
          content: 'blue'
        }
      ]
    }
  },
  jsonld() {
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        name: 'Pomogatorus',
        headline: this.article.preview,
        image: '',
        author: {
          '@type': 'Organization',
          name: 'Pomogatorus'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Pomogatorus',
          logo: {
            '@type': 'ImageObject',
            url: ''
          }
        },
        datePublished: this.article.created_at
      }
    ]
  },
  computed: {
    refactored_content() {
      return JSON.parse(JSON.parse(this.article.content))
    },
    ComponentLayout() {
      return this.params_of_component.name === 'questions'
        ? Vue.extend(Question)
        : this.params_of_component.name === 'image'
          ? Vue.extend(ImageLayout)
          : Vue.extend(LoginAuth)
    },
    isShowTitle() {
      return this.coordYNav <= 0 && this.coordYNav !== null
    },
    getFirstTag() {
      return (this.article._all_public_name_tags.length)
        ? this.article._all_public_name_tags[0]
        : ''
    },
    listArticlesExcludeCurrent() {
      return this.$store.state.ArticleModule.list_filtered_articles.filter((obj) => {
        return obj.id !== this.article.id
      })
    },
    getFilterByMainTag() {
      return '&filter[tag][]=' + this.article._all_public_tags[0]?.code
    }
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
  async mounted() {
    this.$route.meta.title = this.article?.name

    // eslint-disable-next-line nuxt/no-env-in-hooks
    if (process.client) {
      window.addEventListener('scroll', this.scrollWindow)
    }
    this.initializeContent().then(() => {
      setTimeout(() => {
        this.changeIndexQuestion()
        this.$store.commit('change_refactoring_content', false)
        this.findQuestions()
      })
      // SCROLL TO AUTH BLOCK IF WE COME FROM EMAIL MESSAGE
      setTimeout(() => {
        if (this.$route.hash) {
          const elem = document.getElementById(this.$route.hash.split('#').pop())
          const top = window.scrollY + elem.getBoundingClientRect().top - this.heightNav - 54
          window.scrollTo(0, top)
        }
      }, 200)
    })

    await this.$store.dispatch('getListArticles', this.getFilterByMainTag)
  },
  beforeDestroy() {
    this.$store.state.ArticleModule.selectedComponent = {}
    this.$store.state.ArticleModule.countLayout = 0
    this.$store.state.ArticleModule.count_of_questions = 0
    this.$store.state.ArticleModule.components_after_request = []

    this.$store.commit('set_answers', [])
  },
  destroyed() {
    // eslint-disable-next-line nuxt/no-env-in-hooks
    if (process.client) {
      window.removeEventListener('scroll', this.scrollWindow)
    }
  },
  methods: {
    // SCROLL EVENT
    scrollWindow() {
      setTimeout(() => {
        if (this.$refs.nav) {
          this.coordYNav = this.$refs.nav.getBoundingClientRect().y
          this.heightNav = this.$refs.nav.getBoundingClientRect().height
        }
      }, 1000)
    },

    // CHANGE VIEW OF ARTICLE
    setView(value) {
      if (value === 'normal') {
        this.renderNormal()
      } else {
        this.renderFlat()
      }
    },
    renderNormal() {
      this.renderArticle = true
      this.$nextTick(() => {
        this.renderArticle = false

        this.$store.commit('change_refactoring_content', true)
        this.initializeContent().then(() => {
          setTimeout(() => {
            this.changeIndexQuestion()
            this.$store.commit('change_refactoring_content', false)
          })
        })
      })
    },
    renderFlat() {
      const components = Array.from(document.getElementsByClassName('article_component'))

      const contentElement = document.getElementsByClassName('article-template__content')[0]
      contentElement.innerHTML = ''

      components.forEach(elem => {
        contentElement.appendChild(elem)
      })
    },

    // RENDER ARTICLE
    changeIndexQuestion() {
      const questions = [...document.getElementsByClassName('question_wrapper')]

      this.$nextTick(() => {
        let counter = 1

        questions.forEach((elem) => {
          const tmpStr = elem.id.match('-(.*)')
          const id = tmpStr[tmpStr.length - 1]

          const component = this.data_of_components
            .filter((elem) => {
              return elem.data.component.name === 'question' || elem.data.component.name === 'questions'
            })
            .filter((elem) => {
              return elem.data.index == id
            })


          if (component.length) {
            const keyData = `index_${component[0].data.component.name}`
            component[0].instance.$data[keyData] = counter

            counter++
          }
        })
      })
    },
    initializeContent() {
      return new Promise((resolve) => {
        if (JSON.parse(JSON.parse(JSON.parse(this.article.inserted_components))).length) {
          const questionsData = this.article.questions

          const arrOfComponents = JSON.parse(JSON.parse(JSON.parse(this.article.inserted_components)))
          const promises = []

          arrOfComponents.forEach((elem) => {
            if (elem.component.name === 'questions') {
              const question = questionsData.filter(question => {
                return question.id == elem.component.id
              })[0]
              if (question) {
                this.$store.commit('changeSelectedComponent', {
                  data: question,
                  index: elem.index,
                  component: elem.component
                })
              }
            } else if (elem.component.name === 'image') {
              promises.push(this.$store.dispatch('imageFromServer', elem))
            } else if (elem.component.name === 'auth') {
              promises.push(this.$store.dispatch('getAuth', elem))
            }
          })

          Promise.all(promises).finally(() => {
            const arr = []
            this.$store.state.ArticleModule.components_after_request.forEach((elem) => {
              arr.push(elem)
            })
            arr.sort((a, b) => {
              return a.index - b.index
            })

            this.$nextTick(() => {
              arr.forEach((elem) => {
                setTimeout(() => {
                  this.checkTypeComponent(elem)
                  let data = {}
                  if (elem.component.name === 'image') {
                    const fullUrl = document
                      .getElementById(`component_wrapper-${elem.index}`)
                      .getElementsByClassName('inserted_image')[0].src
                    const subUrl = fullUrl.split('.com')
                    const alt = document
                      .getElementById(`component_wrapper-${elem.index}`)
                      .getElementsByClassName('inserted_image')[0].alt
                    const title = document
                      .getElementById(`component_wrapper-${elem.index}`)
                      .getElementsByClassName('inserted_image')[0].title
                    data = Object.assign(
                      {},
                      { name: alt },
                      {
                        full_path: subUrl[1]
                      },
                      { title }
                    )
                    this.$store.commit('M_selectedComponent', {})
                    // return
                  } else data = elem.data

                  this.$store.commit('M_countLayout', elem.index)
                  this.$store.commit('M_selectedComponent', data)
                  const countLayout = this.$store.state.ArticleModule.countLayout
                  const range = document.createRange()
                  range.selectNode(document.getElementById(`component_wrapper-${elem.index}`))
                  range.deleteContents()
                  range.collapse(false)
                  this.data_of_components.push(this.getStructureForInstance(elem.component))
                  this.data_of_components[countLayout - 1].instance.$mount() // pass nothing
                  range.insertNode(this.data_of_components[elem.index - 1].instance.$el)
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
        const name = Object.prototype.hasOwnProperty.call(elem.component, 'index_question')
          ? 'question'
          : elem.component.name
        this.$store.commit('M_count_of_questions', elem.component[`index_${name}`])
      }
    },
    getStructureForInstance(dataComponent) {
      Vue.use(VuetifyClass)
      const vuetify = new VuetifyClass()
      const store = this.$store
      const router = this.$router
      const instance = new this.ComponentLayout({
        store,
        vuetify,
        router
      })
      const data = new this.Imported_component({
        index: this.$store.state.ArticleModule.countLayout,
        component: dataComponent
      })
      const params = Object.assign({}, { instance }, { data })
      return new this.Constructor_instance(params)
    },
    findQuestions() {
      if (!this.data_of_components.length) {
        return
      }
      this.computedQuestions = this.data_of_components.filter(elem => {
        return elem.data.component.name === 'questions'
      })
    },

    /* CONSTRUCTORS */
    Imported_component(data) {
      const { index, component } = data

      this.index = index
      this.component = component
    },
    Constructor_instance(params) {
      const { data, instance } = params

      this.data = data
      this.instance = instance
    }
  }
}
</script>

<style lang='scss' scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */
{
  opacity: 0;
}

.hidden-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  background: #ffffff;
}

.article-template {
  margin: 0 0 80px 0;
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

  .mainTitleFont {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: baseline;
  }

  &__header {
    &__title {
      margin: 10px 0 10px 0;
      padding-bottom: 6px;
    }
  }

  &__content {
    word-break: normal;
    max-width: 1140px;

    h2 {
      font-family: 'Roboto', sans-serif !important;
      color: rgb(32, 33, 36) !important;
      font-size: 1.25rem !important;
    }
  }
}

.showArticleHeader {
  opacity: 1;
  top: 0;
  z-index: 203;
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

.article_info_wrapper__feedback {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 815px;
}

.article_info_wrapper__more_article__wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  grid-template-rows: auto;
  grid-gap: 1em;
  max-width: 870px;
  padding-top: 3em;
  flex-wrap: wrap;


}

.article_info_wrapper__divider {
  max-width: 815px;
  margin: 1em 0;
}

.icons_wrapper {
  display: flex;
  justify-content: space-between;

  margin-right: 1em;
}
</style>
