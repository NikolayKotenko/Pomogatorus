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
        :is-hide-selected="false"
        :is-chips="true"
        :internal-data="selectedChips"
        @update-search-input="localGetListArticles"
        @change-search="setSelected"
        @click-clear="$store.dispatch('SearchModule/getListBasedArticles'); selectedChips = ''"
      >
      </SearchStyled>
<!--      <ChipsStyled-->
<!--        :list-chips="$store.state.PopularSelectionsModule.list_selections.map((elem) => elem.name)"-->
<!--        @click-chip="setChip"-->
<!--      >-->
<!--      </ChipsStyled>-->
    </div>
    <div v-if='$store.state.SearchModule.listArticles.length' class='list_container'>
      <Article v-for='(article, index) in $store.state.SearchModule.listArticles' :key='index' :article='article' />
    </div>
  </v-container>

</template>

<script>
import Article from '../components/Article/Article'
import SearchStyled from "../components/Common/SearchStyled.vue";
import ChipsStyled from "../components/Common/ChipsStyled.vue";
import VerticalMenu from "../components/VerticalMenu.vue";

export default {
  name: 'index.vue',
  components: {ChipsStyled, Article , SearchStyled, VerticalMenu},
  data: () => ({
    selectedArticle: null,
    selectedChips: ''
  }),
  head: {
    title: 'Главная',
    meta: []
  },

  async mounted() {
    await this.$store.dispatch('SearchModule/getListBasedArticles')
    await this.$store.dispatch('PopularSelectionsModule/getListSelections')
  },

  created() {},
  methods: {
    setSelected(selectedObj){
      console.log('setSelected', selectedObj)
      this.selectedArticle = selectedObj;
    },
    async localGetListArticles(searchString){
      console.log('localGetListArticles', searchString)
      await this.$store.dispatch('SearchModule/getArticlesBySymbols', searchString)
    },
    setChip(chip) {
      this.selectedChips = chip
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

