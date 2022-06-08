<template>
  <div class="list_container">
    <Article
      v-for="(article, index) in $store.state.list_articles"
      :key="index"
      :article="article"
    />
  </div>
</template>

<script>
import Article from "../../components/Article/Article";
export default {
  name: "index.vue",
  components: {Article},
  data: () => ({
  }),
  meta: {
  },
  async fetch() {
   await this.$store.dispatch('req_list_articles')
  },
  created() {
    // if (process.server) {
    //   console.log('server')
    //   this.$store.dispatch('nuxtServerInit')
    // } else {
    //   console.log('client')
    //   this.$store.dispatch('req_list_articles')
    // }
  },
  mounted() {
    this.$store.commit('change_breadcrumbs', [
      { text: 'Главная', disabled: false, link: true, exact: true, to: '/'},
      { text: 'Статьи', disabled: true, link: true, exact: true, to: '/articles'}
    ])
  },
  methods: {

  },
}
</script>

<style scoped lang="scss">

</style>
