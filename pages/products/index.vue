<template>
  <v-container class="products">
    <SearchStyled
      :is-class="'styleSearch'"
      :is-placeholder="'Поиск оборудования'"
      :is-loading="$store.state.PopularSelectionsModule.loadingState"
      :is-disabled="$store.state.PopularSelectionsModule.loadingState"
      :is-items="$store.state.PopularSelectionsModule.list_selections"
      :is-clearable="true"
      :is-item-text="'text'"
      :is-item-value="'text'"
      :is-hide-selected="true"
      @update-search-input="localGetListItems"
      @click-clear="$store.dispatch('PopularSelectionsModule/getListSelections');"
    />
    <ProductCard/>
    <ProductCard/>
  </v-container>
</template>
<script>
import SearchStyled from '../../components/Common/SearchStyled.vue';
import ProductCard from '../../components/Common/ProductCard.vue';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Index',
  components: { ProductCard, SearchStyled },
  mounted() {
  }
}
</script>

<style scoped>

</style>
