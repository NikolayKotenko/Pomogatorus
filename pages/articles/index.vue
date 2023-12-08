<template>
  <v-container class="search_page">
    <div class="wrapper_search">
      <!--      <SearchStyled -->
      <!--        :class="'styleSearch'" -->
      <!--        :is-placeholder="'Поиск тегов, статей'" -->
      <!--        :is-loading="loading" -->
      <!--        :is-disabled="loading" -->
      <!--        :is-items="listVariables" -->
      <!--        :is-clearable="true" -->
      <!--        :is-item-text="'text'" -->
      <!--        :is-item-value="'text'" -->
      <!--        :is-hide-selected="false" -->
      <!--        :is-custom-template-selections="true" -->
      <!--        :internal-data="selectedChips" -->
      <!--        @update-search-input="localGetListItems" -->
      <!--        @change-search="setSelected" -->
      <!--        @click-clear="getListBasedArticles(); selectedChips = ''" -->
      <!--        @redirect="redirectData" -->
      <!--      /> -->
      <!--      &lt;!&ndash;      <ChipsStyled &ndash;&gt; -->
      <!--      &lt;!&ndash;        :list-chips="$store.state.PopularSelectionsModule.list_selections.map((elem) => elem.name)" &ndash;&gt; -->
      <!--      &lt;!&ndash;        @click-chip="setChip" &ndash;&gt; -->
      <!--      &lt;!&ndash;      > &ndash;&gt; -->
      <!--      &lt;!&ndash;      </ChipsStyled> &ndash;&gt; -->
      <!--    </div> -->
      <div v-if="listArticles.length" class="list_container">
        <Article v-for="(article, index) in listArticles" :key="index" :article="article"/>
      </div>

      <v-overlay :value="!loadComponent">
        <v-progress-circular
          indeterminate
          size="64"
        />
      </v-overlay>
    </div>
  </v-container>
</template>

<script>
import Article from '@/components/Article/Article';
import SearchStyled from '@/components/Common/SearchStyled.vue';
import Request from '~/services/request';
import constructFilterQuery from '~/utils/constructFilterQuery';

export default {
  name: 'index.vue',
  components: { Article, SearchStyled },
  data: () => ({
    selectedArticle: null,
    selectedChips: '',
    loadComponent: false,
    listArticles: [],
    listVariables: [],
    loading: false,
    debounceTimeout: null
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
    setSelected(selectedObj) {
      this.selectedArticle = selectedObj;
    },
    localGetListItems(searchString) {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);

      this.debounceTimeout = setTimeout(async () => {
        await this.getArticlesBySymbols(searchString);
      }, 500);
    },
    setChip(chip) {
      this.selectedChips = chip;
    },
    redirectData(data) {
      if (data.category === 'Тэги') {
        window.location.href = '/podborki/' + data.data.code;
      }
      if (data.category === 'Статьи') {
        window.location.href = '/articles/' + data.data.id;
      }
    },
    async getArticlesBySymbols(symbols) {
      this.loading = true;

      const result = await Request.get(
        `${this.$store.state.BASE_URL}/entity/articles/search/{q}?q=${symbols}`
      );
      this.listVariables = result.data;

      const payload = (symbols) ? { name_or_tags: symbols } : null;
      await this.getListBasedArticles(payload);
      this.loading = false;
    },
    async getListBasedArticles(queryParams) {
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
};
</script>

<style lang="scss" scoped>
.search_page {
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

