<template>
  <v-container class="podborki_detail">
    <div v-if='main_tag.description' class='tag-template'>
      <v-card class='mt-5 mb-5 pa-5' style='word-break: break-word' v-html='main_tag.description'></v-card>
    </div>
<!--    <div class='auth-template mt-5'>-->
<!--      <LoginAuth />-->
<!--    </div>-->
    <div class="content_wrapper">
      <div v-if='$store.state.PopularSelectionsModule.questions.length'>
        <h3 class="text_tag_question">Вопросы по тегу:
          <HashTagStyled
            :text="main_tag.name"
        >
        </HashTagStyled></h3>
        <div v-for='(question, index) in $store.state.PopularSelectionsModule.questions'>
          <Question
            class="question_card"
            :key='index'
            :props-data='question'
            :props-index='index + 1'
          />
        </div>
      </div>
      <div v-if='$store.state.PopularSelectionsModule.article.length'>
        <h3 class="text_tag_article">Статьи по тегу</h3>
        <div v-for='(article, index) in $store.state.PopularSelectionsModule.article'>
          <ArticleSmallCard
            class="small_card"
            :key='index'
            :article='article'
          />
        </div>
      </div>
    </div>

    <footer-summary></footer-summary>
  </v-container>
</template>

<script>
import Question from '../../components/frontLayouts/Question'
import LoginAuth from '../../components/frontLayouts/LoginAuth'
import Article from '../../components/Article/Article'
import Request from '../../services/request'
import ArticleSmallCard from "../../components/Article/ArticleSmallCard.vue";
import HashTagStyled from '~/components/Common/HashTagStyled'

const vuetify_class = require('vuetify')

export default {
  name: '_code.vue',
  components: {
    ArticleSmallCard,
    Question,
    LoginAuth,
    Article,
    HashTagStyled
  },
  async asyncData({ store, params }) {
    try {
      const request = await Request.get(`${store.state.BASE_URL}/dictionary/tags-by-code/${params.code}`, '', true)
      const main_tag = request.data
      return { main_tag }
    } catch (error) {
      console.warn(error.response.data.message)
    }
  },
  data: () => ({
    params_of_component: {
      name: ''
    },
    data_of_components: [],
    coordYNav: null,
    heightNav: 70
  }),
  head() {
    return {
      title: `${this.main_tag?.seo_title}`,
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width,initial-scale=1,viewport-fit=cover,maximum-scale=1'
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `${this.main_tag?.seo_keywords}`
        },
        {
          hid: 'description',
          name: 'description',
          content: `${this.main_tag?.seo_description}`
        },
        {
          hid: 'theme-color',
          name: 'theme-color',
          content: 'blue'
        }
      ]
    }
  },
  created() {
  },
  async mounted() {
    this.$route.meta.title = this.main_tag?.name
    await this.$store.dispatch('PopularSelectionsModule/getArticlesInfo', this.$route.params.code)
    await this.$store.dispatch('PopularSelectionsModule/getQuestionsInfo', this.$route.params.code)
  },
  watch: {},
  computed: {},
  methods: {}
}
</script>

<style lang='scss' scoped>
@import '@/assets/styles/lists';

.podborki_detail {

  .content_wrapper {
    display: grid;
    //grid-template-columns: (auto-fit (3fr 1fr));
    grid-template-columns: 3fr 1fr;
    row-gap: 1em;
    column-gap: 1em;
    @media screen and (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .question_card {
    margin-bottom: 1em;
  }

  .small_card {
    margin-bottom: 1em;
  }

  .text_tag_question {
    //margin: 1em 0 1em 1em;
    font-size: 1.2em;
    font-weight: 500;
  }

  .text_tag_article {
    margin: 1em 0 1em 0;
    font-size: 1.2em;
    font-weight: 500;
  }

  .tag-template {
    .textarea {
      box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);

      padding: 1em;
      word-break: break-word;
    }
  }

  .auth_container {
    margin-right: auto !important;
    margin: unset;
  }
}
</style>
