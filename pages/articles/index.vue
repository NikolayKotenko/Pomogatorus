<template>
  <v-container class='list_container'>
    <!-- TODO ругается без клиент онли шо пздц ПАМАГИТЕ   -->
    <client-only v-if='articles'>
      <Article v-for='(article, index) in articles' :key='index' :article='article' />
    </client-only>
  </v-container>
</template>

<script>
import Article from '../../components/Article/Article'
import Request from '../../services/request'

export default {
  name: 'index.vue',
  components: { Article },
  data: () => ({}),
  head: {
    title: 'Статьи',
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
