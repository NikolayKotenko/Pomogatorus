<template>
  <div>
    <div class="wrapper_search">
      <SearchStyled
        :is-placeholder="'Поиск тегов, статей'"
        :is-loading="$store.state.SearchModule.loading"
        :is-disabled="$store.state.SearchModule.loading"
        :is-items="$store.state.SearchModule.listArticles"
        :is-item-text="'name'"
        :is-item-value="'id'"
        :is-selected="selectedArticle"
        :is-search-input-sync="searchString"
        @update-search-input="localGetListArticles"
      >
      </SearchStyled>
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
import SearchStyled from "../../components/Common/SearchStyled.vue";

export default {
  name: 'index.vue',
  components: { Article , SearchStyled},
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

.wrapper_search {
  margin: 0 !important;
  padding: 0 !important;
}


</style>
