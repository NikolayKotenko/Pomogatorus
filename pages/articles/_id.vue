<template>
  <v-container class="article-wrapper">
    <div class="sticky-right">
      <ArticleAnchors
        v-if="getArticleTitles.length"
        :data-articles="getArticleTitles"
        @scrollInto="scrollIntoArticle"
      />
    </div>

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

    <!--  DEPRECATED  -->
    <!--    <ProductsWidget/> -->

    <ViewerStyled ref="viewer" :images="totalImages" class="viewer">
      <img
        v-for="(image, index) in totalImages"
        :key="index"
        :src="getSrc(image)"
        alt=""
        class="main_img inserted_image d-none"
      >
    </ViewerStyled>

    <template v-if="tagsArticles.length">
      <template v-for="(tag, index) in tagsArticles">
        <div v-if="tag.articles.length" :key="index + '_tags'" class="article_info_wrapper__more_article">
          <h3>
            Ещё статьи по тегу:
            <HashTagStyled :text="tag.name"/>
          </h3>
          <div class="article_info_wrapper__more_article__wrapper">
            <ArticleSmallCard
              v-for="(obj, key) in tag.articles"
              :key="key"
              :article="obj"
            />
          </div>
        </div>
      </template>
    </template>

    <Biathlon
      v-if="! $store.state.ArticleModule.refactoring_content"
      :article="article"
      :questions="computedQuestions"
      :view-action="localViewAction"
    />
    <v-overlay :value="$store.state.ArticleModule.refactoring_content" z-index="10">
      <v-progress-circular :size="50" color="primary" indeterminate style="margin-top: 20px"/>
    </v-overlay>

    <!-- TODO: DEPRECATED, Теперь у нас есть боковой виджет объекта -->
    <!--    <footer-summary></footer-summary> -->
  </v-container>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import ArticleSmallCard from '../../components/Article/ArticleSmallCard.vue'
import Biathlon from '../../components/Common/Biathlon.vue'
import ArticleAnchors from '../../components/Widgets/ArticleAnchors'
import ViewerStyled from '~/components/Common/ViewerStyled'
import ImageLayout from '~/components/frontLayouts/ImageLayout'
import Question from '~/components/frontLayouts/Question'
import NomenclatureArticle from '~/components/frontLayouts/NomenclatureArticle'
import LoginAuth from '~/components/frontLayouts/LoginAuth'
import ArticleInfo from '~/components/Article/ArticleInfo'
import HashTagStyled from '~/components/Common/HashTagStyled'
import Request from '~/services/request'

const VuetifyClass = require('vuetify')

export default {
  components: { ArticleAnchors, Biathlon, ArticleSmallCard, ArticleInfo, HashTagStyled, ViewerStyled },
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

    renderArticle: false,
    debounceTimeout: null,
    localViewAction: false
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
    ...mapGetters(['getUserId']),
    ...mapGetters('Objects', ['getIdCurrentObject']),

    getArticleTitles() {
      if (!process.client) {
        return []
      }

      const result = []

      if (!this.refactored_content || this.renderArticle) {
        return result
      }

      const wrapper = document.querySelector('.article-template__content')

      if (!wrapper) {
        return result
      }

      const titles = wrapper.getElementsByTagName('h2')

      if (!titles) {
        return result
      }

      [...titles].forEach((elem) => {
        result.push({
          name: elem?.innerText ?? '',
          link: elem
        })
      })

      return result
    },
    totalImages() {
      return this.$store.state.ArticleModule.totalImages
    },

    refactored_content() {
      return JSON.parse(JSON.parse(this.article.content))
    },
    ComponentLayout() {
      if (this.params_of_component.name === 'questions') {
        return Vue.extend(Question)
      }

      if (this.params_of_component.name === 'image') {
        return Vue.extend(ImageLayout)
      }

      if (this.params_of_component.name === 'nomenclature') {
        return Vue.extend(NomenclatureArticle)
      }

      return Vue.extend(LoginAuth)
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
    },
    tagsArticles() {
      const tagsArticles = []
      const alreadyAddedArticles = []

      this.listArticlesExcludeCurrent.forEach((article) => {
        article.mtomtags.forEach((tag) => {
          const findedTagArticle = tagsArticles.find((elem) => elem?.code === tag?.dtags?.code)
          if (findedTagArticle) {
            if (findedTagArticle.articles.length >= 8) {
              return
            }

            if (alreadyAddedArticles.includes(article.id)) {
              return
            }

            findedTagArticle.articles.push(article)
            alreadyAddedArticles.push(article.id)
          } else {
            if (alreadyAddedArticles.includes(article.id)) {
              return
            }

            tagsArticles.push({
              name: tag.dtags.name,
              articles: [article],
              code: tag.dtags.code
            })
          }
        })
      })

      return tagsArticles.sort((a, b) => {
        if (a.articles.length < b.articles.length) {
          return 1
        }
        if (a.articles.length > b.articles.length) {
          return -1
        }
        return 0
      })
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
    },
    '$store.state.ArticleModule.indexImage': {
      handler(nv, ov) {
        if (nv === -1) {
          this.$refs.viewer.open(ov)
        } else {
          this.$refs.viewer.open(nv)
        }
      }
    },
    'getUserId': {
      handler(v) {
        this.getAnswers()
      }
    },
    'getIdCurrentObject': {
      handler(v) {
        this.getAnswers()
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

        this.getAnswers()
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
  created() {
    // eslint-disable-next-line nuxt/no-globals-in-created
    if (process.client) window.addEventListener('scroll', this.handleScroll)
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
      window.removeEventListener('scroll', this.handleScroll)
    }
  },
  methods: {
    /* ARTICLE TITLES */
    scrollIntoArticle(index) {
      const wrapper = document.querySelector('.article-template__content')

      if (!wrapper) {
        return
      }

      const titles = wrapper.getElementsByTagName('h2')

      if (!titles || index === undefined) {
        return
      }

      const y = [...titles][index].getBoundingClientRect().top + window.scrollY - 70

      window.scroll({
        top: y,
        behavior: 'smooth'
      })

      // [...titles][index].scrollIntoView({ block: 'start', behavior: 'smooth' })
    },

    /* ANSWERS */
    getAnswers() {
      if (this.getUserId && this.getIdCurrentObject) {
        const query = {
          id_user: this.getUserId,
          id_object: this.getIdCurrentObject
          // id_article: this.$route.params.id
        }
        this.$store.dispatch('getAnswersFromServer', query)
      }
    },

    getSrc(item) {
      return this.$store.state.BASE_URL + item?.src
    },

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
              return parseInt(elem.data.index) === parseInt(id)
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
                return parseInt(question.id) === parseInt(elem.component.id)
              })[0]
              if (question) {
                this.$store.commit('changeSelectedComponent', {
                  data: question,
                  index: elem.index,
                  component: elem.component
                })
              }
            } else if (elem.component.name === 'nomenclature') {
              promises.push(this.$store.dispatch('nomenclatureFromServer', elem))
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
                      {
                        name: alt,
                        full_path: subUrl[1],
                        title,
                        index_image: elem.component.index_image
                      }
                    )
                    this.$store.commit('M_selectedComponent', {})
                  } else {
                    data = elem.data
                  }

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
      const $toast = this.$toast
      const instance = new this.ComponentLayout({
        store,
        vuetify,
        router,
        $toast
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
    },
    handleScroll() {
      if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 50) {
        this.localViewAction = true
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import 'assets/styles/style';

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

.article-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
}

.article-template {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__subHeader {
    transition: $transition;
    box-shadow: 0px 7px 10px 2px rgba(34, 60, 80, 0.2);
    padding: 10px;
    position: fixed;
    top: -40px;
    opacity: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: -1;
    background: #f3f3f3;
    max-width: 850px;
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
    max-width: 850px;

    h2 {
      font-family: 'Roboto', sans-serif !important;
      color: rgb(32, 33, 36) !important;
      font-size: 1.25rem !important;
      border-bottom: 1px solid #DDDDDD !important;
    }

    ul > li {
      list-style-type: disc !important;
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

.article_info_wrapper__more_article {
  padding-top: 1rem;
  width: 850px;
  margin: 0 auto;
}

.article_info_wrapper__more_article__wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  grid-template-rows: auto;
  grid-gap: 1em;
  max-width: 850px;
  padding-top: 2em;
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

.sticky-right {
  height: 100%;
  position: absolute;
  background: transparent;
  width: 304px;
  min-height: 400px;
  top: 86px;
  right: 0;
}
</style>
