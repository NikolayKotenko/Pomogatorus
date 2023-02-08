<template>
  <div>
    <div class="wrapper_search">
      <v-autocomplete class="search"
        outlined
        dense
        hide-details
        placeholder="Выберите агента"
        :loading="$store.state.SearchModule.loading"
        :disabled="$store.state.SearchModule.loading"
        hide-no-data
        label="Помощник назначения агента"
        :items="$store.state.SearchModule.listArticles"
        item-text="name"
        item-value="id"
        return-object
        clearable
        v-model="selectedArticle"
        :search-input.sync="searchString"
        @update:search-input="localGetListArticles"
      >
      </v-autocomplete>
      <v-chip-group class="tags"></v-chip-group>
    </div>
    <div v-if='articles' class='list_container'>
      <Article v-for='(article, index) in articles' :key='index' :article='article' />
    </div>
  </div>

</template>

<script>
import Article from '../../components/Article/Article'
import Request from '../../services/request'

export default {
  name: 'index.vue',
  components: { Article },
  data: () => ({
    selectedArticle: null,
    searchString: '',
  }),
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
  mounted() {

  },
  created() {},
  methods: {
    async localGetListArticles(){
      await this.$store.dispatch('SearchModule/getArticlesBySymbols', this.searchString)
    }
  }
}
</script>

<style lang='scss' scoped>

.search {

}

</style>
