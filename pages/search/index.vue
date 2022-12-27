<template>
  <div v-if='articles' class='list_container'>
    <Article v-for='(article, index) in articles' :key='index' :article='article' />
  </div>
</template>

<script>
import Article from '../../components/Article/Article'
import Request from '../../services/request'

export default {
  name: 'index.vue',
  components: { Article },
  data: () => ({}),
  head: {
    title: 'Поиск',
    meta: []
  },
  async asyncData({ store, params }) {
    try {
      const query = {
        'filter[activity]': true
      }
      const result = await Request.get(`${store.state.BASE_URL}/entity/articles`, query, true)
      const articles = result.data
      return { articles }
    } catch (error) {
      console.warn(error)
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>

<style lang='scss' scoped></style>
