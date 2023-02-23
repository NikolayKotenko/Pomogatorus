<template>
  <v-container>
    <div class="wrapper_search">
      <SearchStyled
        :is-placeholder="'Поиск тегов, статей'"
        :is-loading="$store.state.SearchModule.loading"
        :is-disabled="$store.state.SearchModule.loading"
        :is-items="$store.state.SearchModule.listArticles"
        :is-item-text="'name'"
        :is-item-value="'id'"
        :is-hide-selected="true"
        @update-search-input="localGetListArticles"
        @change-search="setSelected"
        @click-clear="$store.dispatch('SearchModule/getListBasedArticles')"
      >
      </SearchStyled>
      <ChipStyled
        local-text="Котельная"
      >
      </ChipStyled>
    </div>
    <div>
      <VerticalMenu
      ></VerticalMenu>
    </div>
    <div v-if='$store.state.SearchModule.listArticles.length' class='list_container'>
      <Article v-for='(article, index) in $store.state.SearchModule.listArticles' :key='index' :article='article' />
    </div>
  </v-container>

</template>

<script>
import Article from '../components/Article/Article'
import SearchStyled from "../components/Common/SearchStyled.vue";
import ChipStyled from "../components/Common/ChipStyled.vue";
import VerticalMenu from "../components/VerticalMenu.vue";

export default {
  name: 'index.vue',
  components: {ChipStyled, Article , SearchStyled, VerticalMenu},
  data: () => ({
    selectedArticle: null,
  }),
  head: {
    title: 'Главная',
    meta: []
  },

  async mounted() {
    await this.$store.dispatch('SearchModule/getListBasedArticles')
  },

  created() {},
  methods: {
    setSelected(selectedObj){
      this.selectedArticle = selectedObj;
    },
    async localGetListArticles(searchString){
      await this.$store.dispatch('SearchModule/getArticlesBySymbols', searchString)
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

