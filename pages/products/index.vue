<template>
  <v-container class="products">
    <!--    <div class="search_container"> -->
    <!--      <SearchStyled -->
    <!--        :is-class="'styleSearch'" -->
    <!--        :is-placeholder="'Поиск оборудования'" -->
    <!--        :is-loading="$store.state.PopularSelectionsModule.loadingState" -->
    <!--        :is-disabled="$store.state.PopularSelectionsModule.loadingState" -->
    <!--        :is-items="$store.state.PopularSelectionsModule.list_selections" -->
    <!--        :is-clearable="true" -->
    <!--        :is-item-text="'text'" -->
    <!--        :is-item-value="'text'" -->
    <!--        :is-hide-selected="true" -->
    <!--        @update-search-input="localGetListItems" -->
    <!--        @click-clear="$store.dispatch('PopularSelectionsModule/getListSelections');" -->
    <!--      /> -->
    <!--      <TooltipStyled :title="'Настроить фильтрацию'"> -->
    <!--        <v-menu :close-on-content-click="false" left offset-y> -->
    <!--          <template #activator="{ on, attrs }"> -->
    <!--            <div v-bind="attrs" v-on="on"> -->
    <!--              <v-icon -->
    <!--                class="share" -->
    <!--                color="#ADADAD" -->
    <!--                size="60" -->
    <!--                v-bind="attrs" -->
    <!--                v-on="on" -->
    <!--              > -->
    <!--                mdi-tune-variant -->
    <!--              </v-icon> -->
    <!--            </div> -->
    <!--          </template> -->
    <!--          <UniversalFilter/> -->
    <!--        </v-menu> -->
    <!--      </TooltipStyled> -->
    <!--    </div> -->
    <ProductCard
      v-for="(item) in $store.state.NomenclatureModule.listNomenclature"
      :key="item.id"
      :data="item"
    />
    <v-pagination
      :length="6"
      color="#F79256"
    />
  </v-container>
</template>
<script>
import SearchStyled from '../../components/Common/SearchStyled.vue';
import ProductCard from '../../components/Common/ProductCard.vue';
import TooltipStyled from '../../components/Common/TooltipStyled.vue';
import UniversalFilter from '../../components/Common/UniversalFilter.vue';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'index.vue',
  components: { UniversalFilter, TooltipStyled, ProductCard, SearchStyled },
  async mounted() {
    await this.$store.dispatch('NomenclatureModule/getListNomenclature');
  },
  methods: {
    localGetListItems() {

    }
  }
};
</script>

<style lang="scss" scoped>
.search_container {
  display: flex;
  grid-column-gap: 1em;

}
</style>
