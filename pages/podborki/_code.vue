<template>
  <v-container class="tags_detail">
    <div class="position-right">
      <div class="sticky-right-top">
        <WrapperStickyCurrentObject
          class="current_object_sticky"
        />
      </div>
    </div>

    <SubHeader/>
    <div
      v-if="$store.state.PopularSelectionsModule.article.length"
      class="more_articles_wrapper"
    >
      <span class="wrapper_header">
        Статьи по тегу: {{ mainTag.name }}
      </span>
      <div class="small_articles_slider">
        <v-slide-group>
          <v-slide-item
            v-for="(article, index) in $store.state.PopularSelectionsModule.article"
            :key="index"
            class="slider_item_style"
          >
            <ArticleSmallCard
              :is-tags-page="true"
              :article="article"
            />
          </v-slide-item>
        </v-slide-group>
      </div>
    </div>

    <div class="pdf_prompt_wrapper">
      <div class="prompt_info">
        <div class="prompt_title">
          Затрудняеетесть с заполнением своего объекта?
        </div>
        <div class="prompt_text">
          Ответы будут использованы для создания технического
          задания  по вашему объекту и генерации PDF-файла,
          это будет полезно при общении с мастерами или
          выборе котла на объект
        </div>
      </div>
      <img :src="require(`~/assets/svg/icons/big_red_question.svg`)" class="prompt_question_img">
      <img :src="require(`~/assets/mascot/pomogaikin_question.svg`)" class="prompt_img">
    </div>

    <div class="content_wrapper">
      <div class="tags_title">
        Список всех вопросов для профессионалов по тегу: {{ mainTag.name }}
      </div>
      <span
        v-if="mainTag.description"
        class="description"
        v-html="mainTag.description"
      />
      <template v-if="! $store.state.ArticleModule.isLoadingAnswers">
        <Question
          v-for="(question, index) in $store.state.PopularSelectionsModule.questions"
          :key="index"
          :props-data="question"
          :props-index="index + 1"
          :outer-answer="getPropertyQuestion(question.id, 'value_answer')"
          :detailed-response="getPropertyQuestion(question.id, 'detailed_response')"
          :id-answer="getPropertyQuestion(question.id, 'id')"
          @answer="setAnswer"
        />
      </template>
      <template v-else>
        <div class="load_questions">
          <v-progress-circular
            color="#FF6347"
            indeterminate
            size="64"
          />
        </div>
      </template>
    </div>

    <!--    <Biathlon -->
    <!--      v-if="$store.state.PopularSelectionsModule.questions" -->
    <!--      :questions="$store.state.PopularSelectionsModule.questions" -->
    <!--    /> -->

    <div class="sticky_panel">
      <div class="progress_bar">
        <v-progress-circular
          size="40"
          width="10"
          value="15"
          color="#FF6347"
        />
        20 из {{ $store.state.PopularSelectionsModule.questions.length }} вопросов заполнено
      </div>


      <div class="bookmarks_and_share">
        <TooltipStyled :is-top="true" :title="'Добавить в закладки'">
          <div
            class="btn_wrapper"
          >
            <v-icon color="#000000">
              mdi-bookmark-outline
            </v-icon>
            <span>В закладки</span>
          </div>
        </TooltipStyled>

        <div
          class="btn_wrapper"
          @click="openModal"
        >
          <v-icon color="#000000">
            mdi-export-variant
          </v-icon>
          <span>Поделиться</span>
        </div>
      </div>
    </div>

    <SocialShare/>

    <Biathlon
      v-if="! $store.state.ArticleModule.refactoring_content"
      :questions="$store.state.PopularSelectionsModule.questions"
      is-collection
    />

    <v-overlay
      :value="$store.state.PopularSelectionsModule.loadingState && $store.state.ArticleModule.refactoring_content"
      opacity="1"
      z-index="102"
    >
      <v-progress-circular
        :size="50"
        color="#FFFFFF"
        indeterminate
        style="margin-top: 20px"
      />
    </v-overlay>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import Question from '../../components/frontLayouts/Question'
import Request from '../../services/request'
import ArticleSmallCard from '../../components/Article/ArticleSmallCard.vue'
import Biathlon from '../../components/Common/Biathlon.vue'
import article from '../../store/modules/article'
import SubHeader from '../../components/SubHeader.vue'
import WrapperStickyCurrentObject from '../../components/Widgets/WrapperStickyCurrentObject.vue'
import ArticleAnchors from '../../components/Widgets/ArticleAnchors.vue'
import TooltipStyled from '../../components/Common/TooltipStyled.vue'
import ViewsAndLikes from '../../components/Common/ViewsAndLikes.vue'
import SocialShare from '../../components/Article/SocialShare.vue'
import isJson from '../../utils/checkJSON';
import question from '../../components/frontLayouts/Question.vue'
import podborki from './index.vue'
import HashTagStyled from '~/components/Common/HashTagStyled'

export default {
  name: '_code.vue',
  components: {
    SocialShare,
    ViewsAndLikes, TooltipStyled,
    ArticleAnchors, WrapperStickyCurrentObject,
    SubHeader,
    Biathlon,
    ArticleSmallCard,
    Question,
    HashTagStyled
  },
  async asyncData({ store, params }) {
    try {
      const request = await Request.get(`${store.state.BASE_URL}/dictionary/tags-by-code/${params.code}`, '', true)
      const mainTag = request.data
      return { mainTag }
    } catch (error) {
      console.warn(error.response.data.message)
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
    localViewAction: false,
  }),
  head() {
    return {
      title: `${this.mainTag?.seo_title}`,
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width,initial-scale=1,viewport-fit=cover,maximum-scale=1'
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `${this.mainTag?.seo_keywords}`
        },
        {
          hid: 'description',
          name: 'description',
          content: `${this.mainTag?.seo_description}`
        },
        {
          hid: 'theme-color',
          name: 'theme-color',
          content: 'blue'
        }
      ]
    }
  },
  computed: {
    question() {
      return question
    },
    ...mapGetters(['getUserId']),
    ...mapGetters('Objects', ['getIdCurrentObject']),

    podborki() {
      return podborki
    },
    article() {
      return article
    },

    filteredAnswers() {
      const idsInBiathlon = this.questions.map((item) => item.id)

      return this.$store.state.ArticleModule.answersFromServer.filter((answer) => {
        return idsInBiathlon.includes(answer.id_question)
      });
    },
  },
  watch: {
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
  created() {
  },
  async mounted() {
    this.$route.meta.title = this.mainTag?.name


    this.$store.commit('PopularSelectionsModule/change_loadingState', true)
    const getArticlesInfo = await this.$store.dispatch('PopularSelectionsModule/getArticlesInfo', this.$route.params.code)
    const getQuestionsInfo = await this.$store.dispatch('PopularSelectionsModule/getQuestionsInfo', this.$route.params.code)
    const promiseAll = Promise.all([getArticlesInfo, getQuestionsInfo])
    promiseAll.finally(() => {
      setTimeout(() => {
        this.$store.commit('PopularSelectionsModule/change_loadingState', false)
      }, 1000)
    })

    this.findQuestions()

    this.getAnswers()
  },

  methods: {
    openModal() {
      this.$store.dispatch('openShareArticleModal')
    },


    // Boolean(JSON.parse("null"))

    findQuestions() {
      if (!this.data_of_components.length) {
        return
      }
      this.computedQuestions = this.data_of_components.filter(elem => {
        return elem.data.component.name === 'questions'
      })

    },
    setAnswer(data) {
      console.log('setA', data)
      this.$store.commit('PopularSelectionsModule/setAnswer', {
        answer: data.answer, id: data.id
      })
      this.getAnswers();
    },
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
    getAnswerByQuestion(idQuestion) {
      if (this.getUserId && this.getIdCurrentObject) {
        const findedAnswer = this.$store.getters.getQuestionAnswer(idQuestion)

        if (findedAnswer?.value_answer) {
          return JSON.parse(findedAnswer?.value_answer) ?? null
        }
        return null

      }
      return null
    },
    getPropertyQuestion(idQuestion, property) {
      if (this.getUserId && this.getIdCurrentObject) {
        const findedAnswer = this.$store.getters.getQuestionAnswer(idQuestion)

        if (findedAnswer) {
          if (isJson(findedAnswer[property])) {
            return JSON.parse(findedAnswer[property])
          }
          return findedAnswer[property]
        }
      }
      return null
    },
  },
}
</script>

<style lang='scss' scoped>
@import 'assets/styles/style';

.title {
  font-size: 1.5em !important;
  font-weight: 700;
}

.tags_detail {
  display: flex;
  flex-direction: column;
  max-width: 850px;
  margin-right: auto;
  margin-left: auto;
  row-gap: 20px;
  font-family: 'Inter', sans-serif;
  align-items: center;
  position: relative;
  .content_wrapper {
    display: grid;
    grid-row-gap: 20px;
    border-radius: $b-r16;
    max-width: 850px !important;
    background-color: $white-color;
    padding: 20px;


    .tags_title {
      @extend .main-page-header;
    }
    .description {
      background-color: $grey1;
      border-radius: $b-r16;
      padding: 20px;
    }
    .load_questions {
      background-color: $grey1;
      height: 100%;
      min-height: 100px;
      border-radius: $b-r16;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .pdf_prompt_wrapper {
    display: flex;
    width: 100%;
    max-width: 850px;
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

  .more_articles_wrapper {
    max-width: 850px;
    margin: 0 auto;
    background-color: $white-color;
    border-radius: $b-r16;
    padding-bottom: 20px;


    .wrapper_header {
      display: flex;
      padding: 20px;
      @extend .main-page-header;
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






  .overlay_style {
    transition: 0s !important;
  }

  //.auth_container {
  //  margin-right: auto !important;
  //  margin: unset;
  //}
}

.position-right {
  height: 100%;
  position: absolute;
  background: transparent;
  width: 304px;
  min-height: 400px;
  top: 133px;;
  right: -200px;
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

.sticky_panel {
  background-color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 850px;
  margin: 40px auto 0;
  padding: 20px;
  border-radius: 30px;
  box-shadow: $doubleShadow;
  position: sticky;
  bottom: 20px;
  z-index: 4;
  width: 100%;

  .progress_bar {
    display: flex;
    align-items: center;
    column-gap: 10px;
  }

  .bookmarks_and_share {
    display: flex;
    grid-column-gap: 20px;

    .btn_wrapper {
      display: flex;
      grid-column-gap: 5px;
      align-items: center;
      background-color: #DDDDDD;
      border-radius: 15px;
      padding: 10px 20px;
      cursor: pointer;
      font-weight: 600;
    }
  }
}

@media only screen and (max-width: 768px) {
  .text_tag_article {
    padding-left: 8px;
  }
  .more_article {
    display: grid;
    justify-content: center;
  }
}
</style>
