<template>
  <v-container class="search_page">
    <div class="wrapper_search">
      <SearchStyled
        :is-placeholder="'Поиск тегов, статей'"
        :is-loading="$store.state.SearchModule.loading"
        :is-disabled="$store.state.SearchModule.loading"
        :is-items="$store.state.SearchModule.listVariables"
        :is-clearable="true"
        :is-item-text="'text'"
        :is-item-value="'text'"
        :is-hide-selected="false"
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

    <v-overlay :value="!loadComponent">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
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
    selectedChips: '',
    loadComponent: false,
  }),
  head: {
    title: '',
    meta: []
  },
  async mounted() {
    await this.$store.dispatch('SearchModule/getListBasedArticles')
    await this.$store.dispatch('PopularSelectionsModule/getListSelections')
    this.loadComponent = true;
  },
  methods: {
    setSelected(selectedObj){
      console.log('setSelected', selectedObj)
      this.selectedArticle = selectedObj;
    },
    async localGetListArticles(searchString){
      await this.$store.dispatch('SearchModule/getArticlesBySymbols', searchString)
    },
    setChip(chip) {
      this.selectedChips = chip
    }
  }
}
</script>

<style lang='scss' scoped>
.search_page{
  display: grid;
  grid-row-gap: 2em;
  align-self: baseline;
  padding-top: unset;
}
.wrapper_search {
  width: 100%;
  margin: 0 !important;
  padding: 0 !important;
}


</style>

