<template>
  <v-app>
    <template v-if="Object.keys($store.state.PopularSelectionsModule.popular_selections).length">
      <div class="tag-template">
        <!--      <v-textarea-->
        <!--        outlined-->
        <!--        label="Default style"-->
        <!--        value="Learning about textareas at Coding Beauty!"-->
        <!--      >-->
        <!--      </v-textarea>-->
        <v-textarea
          outlined
          single-line
          :loading="$store.state.PopularSelectionsModule.loadingState"
        >
          <template v-slot:label>
            <p v-html="$store.state.PopularSelectionsModule.popular_selections.tag.description"></p>
          </template>
        </v-textarea>
      </div>
      <div class="auth-template mt-5">
        <LoginAuth/>
      </div>
      <div class="article-template list_container mt-5">
        <Article
          v-for="(article, index) in $store.state.PopularSelectionsModule.popular_selections.articles"
          :key="index"
          :article="article"
        />
      </div>
      <div class="question-template mt-5">
        <Question
          v-for="(question, index) in $store.state.PopularSelectionsModule.popular_selections.questions"
          :key="index"
          :props-data="question"
          :props-index="question.id"
        />
        <!--      <question v-if="$store.state.PopularSelectionsModule.popular_selections.length !==0"></question>-->
      </div>
    </template>
  </v-app>
</template>

<script>
import Vue from "vue";
const vuetify_class = require("vuetify")

import ImageLayout from "../../components/frontLayouts/ImageLayout";
import Question from "../../components/frontLayouts/Question";
import LoginAuth from "../../components/frontLayouts/LoginAuth";
import Request from "@/services/request";
import Author from "../../components/Article/Author";

import Answers from "../../services/answers/answers";
import ArticleInfo from "../../components/Article/ArticleInfo";
import Article from "../../components/Article/Article";

export default {
  name: "_code.vue",
  components: {
    Question,
    LoginAuth,
    Article
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
  async mounted() {
    await this.$store.dispatch('getSelections', this.$route.params.code);
    this.$store.commit('change_breadcrumbs', [
      { text: 'Главная', disabled: false, link: true, exact: true, nuxt: true, replace: true, to: '/' },
      { text: 'Подборки', disabled: false, link: true, exact: true, nuxt: true, replace: true, to: '/podborki' },
      { text: `${this.$store.state.PopularSelectionsModule.popular_selections.tag.name}`, disabled: true, link: true, exact: true, nuxt: true, replace: true, to: '' }
    ])
  },
  watch: {},
  computed: {},
  methods: {
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
@import '@/assets/styles/lists';
</style>
