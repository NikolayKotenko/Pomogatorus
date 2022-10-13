<template>
  <div class='list_container'>
    <Article v-for='(article, index) in $store.state.ArticleModule.list_articles' :key='index' :article='article' />
  </div>
</template>

<script>
import Article from '../../components/Article/Article'

export default {
  name: 'index.vue',
  components: { Article },
  data: () => ({}),
  head: {
    title: 'Статьи',
    meta: []
  },
  async fetch() {
    await this.$store.dispatch('req_list_articles')
  },
  created() {
  },
  mounted() {
    this.$store.commit('change_breadcrumbs', [
      {
        text: 'Главная',
        disabled: false,
        link: true,
        exact: true,
        to: '/'
      },
      {
        text: 'Статьи',
        disabled: true,
        link: true,
        exact: true,
        to: '/articles'
      }
    ])
  },
  methods: {}
}
</script>

<style lang='scss' scoped></style>
