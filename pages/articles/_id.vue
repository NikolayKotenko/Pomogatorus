<template>
  <v-container class="article-wrapper">
    <!--        <div -->
    <!--          v-if="!$store.state.ArticleModule.refactoring_content && article && computedQuestions" -->
    <!--          class="position_left" -->
    <!--        > -->
    <!--          <div class="sticky-left-top"> -->
    <!--            <Biathlon -->
    <!--              :questions="computedQuestions" -->
    <!--            /> -->
    <!--            <ArticleAnchors -->
    <!--              v-if="getArticleTitles.length" -->
    <!--              :data-articles="getArticleTitles" -->
    <!--              @scrollInto="scrollIntoArticle" -->
    <!--            /> -->
    <!--          </div> -->
    <!--        </div> -->

    <!--    <div -->
    <!--      v-if="!$store.state.ArticleModule.refactoring_content && article" -->
    <!--      class="position-right" -->
    <!--    > -->
    <!--    &lt;!&ndash;      <div class="sticky-right-top"> &ndash;&gt; -->
    <!--            <WrapperStickyCurrentObject -->
    <!--              class="current_object_sticky" -->
    <!--            /> -->
    <!--      </div> -->
    <!--    </div> -->

    <div ref="nav" class="article-template">
      <template v-if="article">
        <SubHeader class="subheader_wrapper"/>

        <div class="article_header_wrapper">
          <div class="img_and_title">
            <v-img
              :src="$store.getters.getImageByEClientFilesObj(article.e_client_files)"
              class="article_img"
              max-width="93"
              height="93"
            />
            <v-divider class="divider" vertical/>
            <div class="article_name">
              {{ article.name }}
            </div>
          </div>
          <div class="article_purpose">
            {{ article.purpose_of_article }}
          </div>
        </div>

        <div class="sticky_panel">
          <img
            :src="require('/assets/svg/icons/dots_bg.svg')"
            class="dots_bg"
          >
          <ViewsAndLikes :article="article" style="z-index: 9"/>
          <div class="bookmarks_and_share">
            <!--        <TooltipStyled :is-top="true" :title="'Добавить в закладки'"> -->
            <!--          <div -->
            <!--            class="btn_wrapper" -->
            <!--          > -->
            <!--            <v-icon color="#000000"> -->
            <!--              mdi-bookmark-outline -->
            <!--            </v-icon> -->
            <!--            <span>В закладки</span> -->
            <!--          </div> -->
            <!--        </TooltipStyled> -->

            <div
              class="btn_wrapper"
              @click="openModal"
            >
              <img
                :src="require('/assets/svg/icons/export_icon.svg')"
              >
              <span>Поделиться</span>
            </div>
          </div>
        </div>

        <div class="main_article_wrapper">
          <div class="left_column_wrapper">
            <div v-if="!renderArticle" class="content_wrapper" v-html="refactored_content"/>

            <template v-if="tagsArticles.length && article">
              <div class="date_info">
                <div class="date_and_views">
                  <div class="date">
                    {{ article.updated_at }}
                  </div>
                  <div v-if="article.views" class="views">
                    <img :src="require('/assets/svg/icons/eye_icon.svg')">
                    {{ article.views }}
                  </div>
                </div>
              </div>

              <div class="widgets_wrapper">
                <WrapperStickyCurrentObject
                  class="current_object_sticky"
                />
                <div class="recommended_products_widget">
                  <div class="widget_header">
                    <v-divider class="divider" vertical/>
                    <div class="title_and_description">
                      <div class="title">
                        Помогайкин рекомендует
                      </div>
                      <div class="description">
                        Подбор на основе параметров объекта
                      </div>
                    </div>
                  </div>
                  <div class="widget_wrapper">
                    <div class="pomogaikin_block">
                      <div class="rectangle_red"/>
                      <img class="pomogaikin_img" :src="require('/assets/mascot/pomogaikin_approves.svg')">
                    </div>
                    <NomenclatureWidget/>
                  </div>
                </div>
              </div>


              <div v-if="tagsArticles[0].articles.length > 2" class="more_articles_wrapper">
                <div class="wrapper_header">
                  <v-divider style="border-width: 2px; border-color: #111111 !important;" vertical/>
                  <span class="text">
                    Похожие статьи по тегам
                  </span>
                </div>
                <div class="small_articles_slider">
                  <v-slide-group>
                    <v-slide-item
                      v-for="(article, index) in tagsArticles[0].articles"
                      :key="index"
                      class="slider_item_style"
                    >
                      <ArticleSmallCard
                        :article="article"
                      />
                    </v-slide-item>
                  </v-slide-group>
                </div>
              </div>
              <div v-else class="another_slider_style">
                <div class="wrapper_header">
                  <v-divider style="border-width: 2px; border-color: #111111 !important;" vertical/>
                  <span class="text">
                    Похожие статьи по тегам
                  </span>
                </div>
                <div class="small_articles_wrapper">
                  <ArticleSmallCard
                    v-for="(article, index) in tagsArticles[0].articles"
                    :key="index"
                    :article="article"
                  />
                </div>
              </div>

              <!--      <template v-for="(tag, index) in tagsArticles"> -->
              <!--        <div v-if="tag.articles.length" :key="index + '_tags'" class="article_info_wrapper__more_article"> -->
              <!--          <h3> -->
              <!--            Ещё статьи по тегу: -->
              <!--            <HashTagStyled :text="tag.name"/> -->
              <!--          </h3> -->
              <!--          <div class="article_info_wrapper__more_article__wrapper"> -->

              <!--          </div> -->
              <!--        </div> -->
              <!--      </template> -->
            </template>
          </div>
          <div class="right_column_wrapper">
            <Biathlon
              :questions="computedQuestions"
            />
            <ArticleAnchors
              v-if="articleContentTitles.length"
              :data-articles="articleContentTitles"
              @scrollInto="scrollIntoArticle"
            />
          </div>
        </div>

        <!--        <div ref="nav" class="article-template__header"> -->
        <!--          &lt;!&ndash;          <div class="title"> &ndash;&gt; -->
        <!--          &lt;!&ndash;            <v-divider class="divider" vertical/> &ndash;&gt; -->
        <!--          &lt;!&ndash;            <div class="article_name"> &ndash;&gt; -->
        <!--          &lt;!&ndash;              {{ article.name }} &ndash;&gt; -->
        <!--          &lt;!&ndash;            </div> &ndash;&gt; -->
        <!--          &lt;!&ndash;          </div> &ndash;&gt; -->
        <!--          &lt;!&ndash;          &lt;!&ndash;          <ArticleInfo :article-data="article" @set-view="setView"/> &ndash;&gt; &ndash;&gt; -->

        <!--          &lt;!&ndash;          <div class="pdf_prompt_wrapper"> &ndash;&gt; -->
        <!--          &lt;!&ndash;            <div class="prompt_info"> &ndash;&gt; -->
        <!--          &lt;!&ndash;              <div class="prompt_title"> &ndash;&gt; -->
        <!--          &lt;!&ndash;                Затрудняеетесть с заполнением своего объекта? &ndash;&gt; -->
        <!--          &lt;!&ndash;              </div> &ndash;&gt; -->
        <!--          &lt;!&ndash;              <div class="prompt_text"> &ndash;&gt; -->
        <!--          &lt;!&ndash;                Ответы будут использованы для создания технического &ndash;&gt; -->
        <!--          &lt;!&ndash;                задания  по вашему объекту и генерации PDF-файла, &ndash;&gt; -->
        <!--          &lt;!&ndash;                это будет полезно при общении с мастерами или &ndash;&gt; -->
        <!--          &lt;!&ndash;                выборе котла на объект &ndash;&gt; -->
        <!--          &lt;!&ndash;              </div> &ndash;&gt; -->
        <!--          &lt;!&ndash;            </div> &ndash;&gt; -->
        <!--          &lt;!&ndash;            <img :src="require(`~/assets/svg/icons/big_red_question.svg`)" class="prompt_question_img"> &ndash;&gt; -->
        <!--          &lt;!&ndash;            <img :src="require(`~/assets/mascot/pomogaikin_question.svg`)" class="prompt_img"> &ndash;&gt; -->
        <!--          &lt;!&ndash;          </div> &ndash;&gt; -->



        <!--          &lt;!&ndash;          <div class="pdf_prompt_wrapper"> &ndash;&gt; -->
        <!--          &lt;!&ndash;            <div class="prompt_info"> &ndash;&gt; -->
        <!--          &lt;!&ndash;              <div class="prompt_title"> &ndash;&gt; -->
        <!--          &lt;!&ndash;                Затрудняеетесть с заполнением своего объекта? &ndash;&gt; -->
        <!--          &lt;!&ndash;              </div> &ndash;&gt; -->
        <!--          &lt;!&ndash;              <div class="prompt_text"> &ndash;&gt; -->
        <!--          &lt;!&ndash;                Ответы будут использованы для создания технического &ndash;&gt; -->
        <!--          &lt;!&ndash;                задания  по вашему объекту и генерации PDF-файла, &ndash;&gt; -->
        <!--          &lt;!&ndash;                это будет полезно при общении с мастерами или &ndash;&gt; -->
        <!--          &lt;!&ndash;                выборе котла на объект &ndash;&gt; -->
        <!--          &lt;!&ndash;              </div> &ndash;&gt; -->
        <!--          &lt;!&ndash;            </div> &ndash;&gt; -->
        <!--          &lt;!&ndash;            <img :src="require(`~/assets/svg/icons/big_red_question.svg`)" class="prompt_question_img"> &ndash;&gt; -->
        <!--          &lt;!&ndash;            <img :src="require(`~/assets/mascot/pomogaikin_question.svg`)" class="prompt_img"> &ndash;&gt; -->
        <!--          &lt;!&ndash;          </div> &ndash;&gt; -->
        <!--        </div> -->
      </template>

      <!--      <div v-if="$store.state.ArticleModule.refactoring_content || !article" class="hidden-mask"/> -->
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


    <SocialShare/>

    <v-overlay :value="$store.state.ArticleModule.refactoring_content" opacity="1" z-index="102">
      <v-progress-circular :size="50" color="#FFFFFF" indeterminate style="margin-top: 20px"/>
    </v-overlay>

    <!-- TODO: DEPRECATED, Теперь у нас есть боковой виджет объекта -->
    <!--    <footer-summary></footer-summary> -->
  </v-container>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { req } from 'vuelidate/lib/validators/common'
import ArticleSmallCard from '../../components/Article/ArticleSmallCard.vue'
import SubHeader from '../../components/SubHeader.vue'
import ViewsAndLikes from '../../components/Common/ViewsAndLikes.vue'
import TooltipStyled from '../../components/Common/TooltipStyled.vue'
import SocialShare from '../../components/Article/SocialShare.vue'
import ArticleAnchors from '../../components/Widgets/ArticleAnchors'
import WrapperStickyCurrentObject from '../../components/Widgets/WrapperStickyCurrentObject.vue'
import Biathlon from '../../components/Common/Biathlon.vue'
import NomenclatureWidget from '../../components/Widgets/NomenclatureWidget.vue'
import ViewerStyled from '~/components/Common/ViewerStyled'
import ImageLayout from '~/components/frontLayouts/ImageLayout'
import Question from '~/components/frontLayouts/Question'
import NomenclatureArticle from '~/components/frontLayouts/NomenclatureArticle'
import LoginAuth from '~/components/frontLayouts/LoginAuth'
import ArticleInfo from '~/components/Article/ArticleInfo'
import Request from '~/services/request'

const VuetifyClass = require('vuetify')

export default {
  components: {
    NomenclatureWidget,
    Biathlon,
    WrapperStickyCurrentObject,
    ArticleAnchors,
    SocialShare,
    TooltipStyled,
    ViewsAndLikes,
    SubHeader,
    ArticleSmallCard,
    ArticleInfo,
    ViewerStyled
  },
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
    localViewAction: false,
    articleContentTitles: [],
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

    formattedTags() {
      if (!this.article) {
        return []
      }

      return this.article._all_public_tags.map((tag, index) => ({
        name: `${tag.name}${index === this.article._all_public_tags.length - 1 ? '' : ', '}`,
        code: tag.code
      }))
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

    this.getArticleTitles()

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
    getArticleTitles() {
      console.log('cheeeck')
      if (!process.client) {
        return []
      }


      if (!this.refactored_content || this.renderArticle) {
        return this.articleContentTitles
      }

      this.$nextTick(() => {
        const wrapper = document.querySelector('.content_wrapper')

        console.log('wrapper', wrapper)

        if (!wrapper) {
          return this.articleContentTitles
        }

        const titles = wrapper.getElementsByTagName('h2')

        if (!titles) {
          return this.articleContentTitles
        }

        [...titles].forEach((elem) => {
          this.articleContentTitles.push({
            name: elem?.innerText ?? '',
            link: elem
          })
        })

        return this.articleContentTitles
      })
    },
    req,
    /* ARTICLE TITLES */
    scrollIntoArticle(index) {
      const wrapper = document.querySelector('.content_wrapper')

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

    openModal() {
      this.$store.dispatch('openShareArticleModal')
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
  max-width: 1140px !important;
  padding: 0 !important;
  .position_left {
    height: 100%;
    position: absolute;
    background: transparent;
    width: 304px;
    min-height: 400px;
    top: 196px;
    left: -340px;
    z-index: 101;
    opacity: .5;
    transition: $transition;
    &:hover {
      opacity: 1;
    }

    .sticky-left-top {
      position: sticky;
      top: 80px;
      left: 0;
      display: flex;
      flex-direction: column;
      row-gap: 15px;
    }
  }
}

.article-template {
  display: flex;
  flex-direction: column;
  max-width: 1140px;
  font-family: 'Inter', sans-serif;
  align-items: center;
  position: relative;

  .subheader_wrapper {
    max-width: 1140px !important;
    width: 100%;
  }

  .article_header_wrapper {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    background-color: $white-color;
    padding: 20px;
    border-radius: 16px 16px 0 0;
    width: 100%;
    .img_and_title {
      display: flex;
      column-gap: 20px;
      .article_name {
        @extend .main-page-header;
        font-weight: 700 !important;
        max-width: 700px;
      }
      .divider {
        border-color: #000000 !important;
        border-width: 3px;
        @media only screen and (max-width: 992px) {
          display: none;
        }
      }
    }
  }
  .main_article_wrapper {
    display: flex;
    column-gap: 20px;
    width: 100%;
    position: relative;
    .left_column_wrapper {
      word-break: normal;
      max-width: 850px;
      width: 100%;
      .content_wrapper {
        background-color: $white-color;
        border-radius: $b-r16;
        margin-top: 20px;
        padding: 20px;
      }
      .date_info {
        display: flex;
        font-family: 'Inter', sans-serif;
        justify-content: end;
        width: 100%;
        margin: 0 auto;
        padding: 12px 20px;

        .date_and_views {
          @extend .grey-text14;
          display: flex;
          grid-column-gap: 20px;
          .views {
            display: flex;
            align-items: center;
            column-gap: 4px;
          }
        }
      }
      .widgets_wrapper {
        display: flex;
        column-gap: 20px;
        .recommended_products_widget {
          display: flex;
          flex-direction: column;
          .widget_header {
            display: flex;
            .divider {
              border-color: #000000 !important;
              border-width: 3px;
              margin-right: 10px;
              @media only screen and (max-width: 992px) {
                display: none;
              }
            }
            .title_and_description {
              display: grid;
              .title {
                @extend .small-header-page;
              }
              .description {
                @extend .text12;
              }
            }
          }
          .widget_wrapper {
            display: flex;
            column-gap: 20px;
            padding-top: 20px;
            .pomogaikin_block {
              position: relative;
              .rectangle_red {
                z-index: 9;
                height: 125px;
                width: 125px;
                background-color: $red;
                border-radius: $b-r8;
              }
              .pomogaikin_img {
                position: absolute;
                top: 50px;
                left: 5px;
              }
            }
          }
        }
      }
     }

    .right_column_wrapper {
      position: sticky;
      top: 90px;
      margin-top: 20px;
      height: 100vh;
      display: flex;
      flex-direction: column;
      row-gap: 20px;
    }
  }

  .mainTitleFont {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: baseline;
  }

  &__header {
    display: grid;
    grid-row-gap: 20px;

    .title {
      display: flex;
      height: auto;

      .divider {
        border-color: #000000 !important;
        border-width: 3px;
        margin-right: 20px;
        @media only screen and (max-width: 992px) {
          display: none;
        }
      }

    }

  }

  &__content {
    word-break: normal;
    max-width: 850px;
    background-color: $white-color;
    border-radius: $b-r16;
    margin-top: 20px;
    padding: 20px;

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

.pdf_prompt_wrapper {
  display: flex;
  padding: 20px 40px 20px 20px;
  background-color: $grey4;
  border-radius: $b-r30;
  color: $white-color;
  position: relative;

  .prompt_info {
    display: grid;
    grid-row-gap: 4px;

    .prompt_title {
      @extend .white-small-header-page
    }

    .prompt_text {
      max-width: 685px;
    }
  }
  .prompt_question_img {
    position: absolute;
    top: 10px;
    right: 110px;
  }
  .prompt_img {
    position: absolute;
    top: -20px;
    right: 25px;
  }
}

.sticky_panel {
  background-color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  display: flex;
  justify-content: start;
  align-items: center;
  height: 70px;
  width: 100%;
  padding: 20px;
  border-radius: 0px 0px 16px 16px;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25), 0px -1px 4px 0px rgba(0, 0, 0, 0.25);
  position: sticky;
  top: 0;
  z-index: 99;
  grid-column-gap: 10px;
  .dots_bg {
    position: absolute;
    z-index: 8;
    top: 0;
    left: 0;
    padding: 5px;
  }
   .bookmarks_and_share {
    display: flex;
    grid-column-gap: 10px;
     z-index: 9;

    .btn_wrapper {
      display: flex;
      grid-column-gap: 5px;
      align-items: center;
      background-color: #DDDDDD;
      border-radius: $b-r8;
      padding: 5px 10px;
      height: 30px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.875em;
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

.tags_and_date_info {
  display: flex;
  font-family: 'Inter', sans-serif;
  justify-content: space-between;
  width: 100%;
  margin: 0 auto;
  padding: 20px 20px;

  .tags {
    display: flex;


.more_articles_wrapper {

  margin: 0 auto;
  opacity: .5;
  transition: $transition;
  &:hover {
    opacity: 1;
  }

  .wrapper_header {
    display: flex;
    padding: 0 60px;
    margin: 20px 0;

    .text {
      margin-left: 20px;
      @extend .header-page;

    }
  }

  .small_articles_slider {
    display: flex;

    .slider_item_style {
      flex: 0 0 auto;
      max-width: 50%;
      margin: 10px;
    }

  }
}

.another_slider_style {
  opacity: .5;
  transition: $transition;
  &:hover {
    opacity: 1;
  }

  .wrapper_header {
    display: flex;
    margin: 20px 0;

    .text {
      margin-left: 20px;
      @extend .header-page;

    }
  }

  .small_articles_wrapper {
    display: flex;
    grid-column-gap: 20px;
    //.slider_item_style {
    //  flex: 0 0 auto;
    //  max-width: 50%;
    //  margin-right: 20px;
    //}

  }
}

.position-right {
  height: 100%;
  position: absolute;
  background: transparent;
  width: 304px;
  min-height: 400px;
  top: 196px;
  right: -314px;
  z-index: 101;
  opacity: .5;
  transition: $transition;
  &:hover {
    opacity: 1;
  }

  .sticky-right-top {
    position: sticky;
    top: 80px;
    right: 0;
    display: flex;
    flex-direction: column;
    row-gap: 15px;
  }

  //.current_object_sticky {
  //  position: absolute;
  //  right: -310px;
  //  top: 63px;
  //}

}
@media only screen and (max-width: 1600px) {
  .position-right {
    display: none !important;
  }
  .position_left {
    display: none !important;
  }
}

.article_name {
  margin: 10px 0 10px 0;
  padding-bottom: 6px;
  font-size: 2em !important;
  font-weight: 700;

  @media only screen and (max-width: 1333px) {
    font-size: 1.5em !important;
  }

  @media only screen and (max-width: 992px) {
    font-size: 1em !important;
  }
}
</style>
