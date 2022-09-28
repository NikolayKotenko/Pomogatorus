<template>
  <v-app>
    <template v-if="Object.keys($store.state.PopularSelectionsModule.popular_selections).length">
      <div class="tag-template">
        <v-textarea class="textarea" v-html="$store.state.PopularSelectionsModule.popular_selections.tag.description" readonly>
        </v-textarea>
      </div>
      <div class="auth-template mt-5">
        <LoginAuth />
      </div>
      <div class="article-template list_container mt-5">
        <Article
          v-for="(article, index) in $store.state.PopularSelectionsModule.popular_selections.articles"
          :key="index"
          :article="article"
        />
      </div>
      <div class="question-template mt-5">
        <template v-if="$store.state.PopularSelectionsModule.popular_selections.questions.length">
          <Question
            v-for="(question, index) in $store.state.PopularSelectionsModule.popular_selections.questions"
            :key="index"
            :props-data="question"
            :props-index="index + 1"
          />
        </template>
        <!--      <question v-if="$store.state.PopularSelectionsModule.popular_selections.length !==0"></question>-->
      </div>
    </template>
  </v-app>
</template>

<script>
import Question from '../../components/frontLayouts/Question'
import LoginAuth from '../../components/frontLayouts/LoginAuth'
import Article from '../../components/Article/Article'

const vuetify_class = require('vuetify')

export default {
  name: '_code.vue',
  components: {
    Question,
    LoginAuth,
    Article,
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
      title: `${this.$store.state.PopularSelectionsModule.popular_selections.tag?.seo_title}`,
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width,initial-scale=1,viewport-fit=cover,maximum-scale=1',
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `${this.$store.state.PopularSelectionsModule.popular_selections.tag?.seo_keywords}`,
        },
        {
          hid: 'description',
          name: 'description',
          content: `${this.$store.state.PopularSelectionsModule.popular_selections.tag?.seo_description}`,
        },
        {
          hid: 'theme-color',
          name: 'theme-color',
          content: 'blue',
        },
      ],
    }
  },
  async fetch() {
    await this.$store.dispatch('getSelections', this.$route.params.code)
  },
  created() {},
  async mounted() {
    this.$store.commit('change_breadcrumbs', [
      {
        text: 'Главная',
        disabled: false,
        link: true,
        exact: true,
        nuxt: true,
        replace: true,
        to: '/',
      },
      {
        text: 'Подборки',
        disabled: false,
        link: true,
        exact: true,
        nuxt: true,
        replace: true,
        to: '/podborki',
      },
      {
        text: `${this.$store.state.PopularSelectionsModule.popular_selections.tag?.name}`,
        disabled: true,
        link: true,
        exact: true,
        nuxt: true,
        replace: true,
        to: '',
      },
    ])
  },
  watch: {},
  computed: {},
  methods: {},
  beforeDestroy() {
  },
  destroyed() {
    if (process.client) {
      window.removeEventListener('scroll', this.scrollWindow)
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/lists';

.tag-template{
  .textarea{
    box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);

    padding: 1em;
    word-break: break-word;
  }
}
.auth_container{
  margin-right: auto!important;
  margin:unset;
}
</style>
