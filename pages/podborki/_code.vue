<template>
    <div>
      <div class="tag-template" v-if="main_tag.description">
        <v-card class="mt-5 mb-5 pa-5" style="word-break: break-word" v-html="main_tag.description"></v-card>
      </div>
      <div class="auth-template mt-5">
        <LoginAuth />
      </div>
      <div class="article-template list_container mt-5" v-if="$store.state.PopularSelectionsModule.article.length">
        <div v-for="(article, index) in $store.state.PopularSelectionsModule.article">
          <Article
            :key="index"
            :article="article"
          />
        </div>
      </div>
      <div class="question-template mt-5" v-if="$store.state.PopularSelectionsModule.questions.length">
        <div v-for="(question, index) in $store.state.PopularSelectionsModule.questions">
          <Question
            :key="index"
            :props-data="question"
            :props-index="index + 1"
          />
        </div>
      </div>

      <footer-summary></footer-summary>
    </div>
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
  async asyncData({ $axios, store, params }) {
    const options = {
      method: 'GET',
      url: `${store.state.BASE_URL}/dictionary/tags-by-code/${params.code}`,
    }
    try {
      const request = await $axios(options)
      const main_tag = request.data.data
      return { main_tag }
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
      title: `${this.main_tag?.seo_title}`,
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width,initial-scale=1,viewport-fit=cover,maximum-scale=1',
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `${this.main_tag?.seo_keywords}`,
        },
        {
          hid: 'description',
          name: 'description',
          content: `${this.main_tag?.seo_description}`,
        },
        {
          hid: 'theme-color',
          name: 'theme-color',
          content: 'blue',
        },
      ],
    }
  },
  created() {},
  async mounted() {
    this.$route.meta.title = this.main_tag?.name;
    await this.$store.dispatch('getArticlesInfo', this.$route.params.code);
    await this.$store.dispatch('getQuestionsInfo', this.$route.params.code);
  },
  watch: {},
  computed: {},
  methods: {},
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
