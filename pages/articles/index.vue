<template>
  <v-container class="search_page">
    <div class="wrapper_search">
      <SubHeader/>
      <div v-if="listArticles.length" class="list_container">
        <div v-for="(article, index) in listArticles" :key="index">
          <v-divider style="margin: 0 30px 20px 30px; border-width: 0.1px;"/>
          <Article :article="article"/>
        </div>
      </div>
    </div>
    <v-overlay :value="! loadComponent" opacity="1">
      <v-progress-circular :size="50" color="#FFFFFF" indeterminate/>
    </v-overlay>
  </v-container>
</template>

<script>
import SubHeader from '../../components/SubHeader.vue'
import Article from '@/components/Article/Article'
import SearchStyled from '@/components/Common/SearchStyled.vue';
import Request from '~/services/request';
import constructFilterQuery from '~/utils/constructFilterQuery';

export default {
  name: 'index.vue',
  components: { SubHeader, Article , SearchStyled  },
  data: () => ({
    selectedArticle: null,
    selectedChips: '',
    loadComponent: false,
    listArticles: [],
    listVariables: [],
    loading: false,
    debounceTimeout: null,
  }),
  head: {
    title: 'Статьи',
    meta: []
  },
  async mounted() {
    await this.getListBasedArticles();
    // await this.$store.dispatch('PopularSelectionsModule/getListSelections')
    this.loadComponent = true;
  },
  methods: {
    setSelected(selectedObj){
      this.selectedArticle = selectedObj;
    },
    localGetListItems(searchString){
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout)

      this.debounceTimeout = setTimeout(async () => {
        await this.getArticlesBySymbols(searchString)
      }, 500)
    },
    setChip(chip) {
      this.selectedChips = chip
    },
    redirectData(data){
      if (data.category === 'Тэги'){
        window.location.href = '/podborki/'+data.data.code
      }
      if (data.category === 'Статьи'){
        window.location.href = '/articles/'+data.data.id;
      }
    },
    async getArticlesBySymbols(symbols) {
      this.loading = true;

      const result = await Request.get(
        `${this.$store.state.BASE_URL}/entity/articles/search/{q}?q=${symbols}`
      );
      this.listVariables = result.data;

      const payload = (symbols) ? { name_or_tags: symbols } : null
      await this.getListBasedArticles(payload)
      this.loading = false;
    },
    async getListBasedArticles(queryParams){
      this.loading = true;

      const basedFilter = { activity: true };
      const query = constructFilterQuery({ ...basedFilter, ...queryParams });

      const response = await Request.get(
        this.$store.state.BASE_URL + '/entity/articles' + query + '&sort[created_at]=desc'
      );
      this.listArticles = response.data;
      this.loading = false;

      return response;
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

