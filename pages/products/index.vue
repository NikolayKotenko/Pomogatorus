<template>
  <v-container class="products_page_wrapper">
    <SubHeader/>  
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
    <!--    <UniversalFilter/> -->
    <ProductCard
      v-for="(item) in $store.state.NomenclatureModule.listNomenclature"
      :key="item.id"
      :data="item"
    />
    <v-btn
      :disabled="!$store.getters.statePaginationHasMorePage"
      block
      class="mt-5 mb-5"
      elevation="2"
      outlined
      @click="getNextPageData"
    >
      {{ $store.getters.statePaginationHasMorePage ? "Показать еще" : "Показаны все элементы" }}
    </v-btn>
    <!--    <WrapperStickyCurrentObject class="current_object_sticky"/> -->
  </v-container>
</template>
<script>
import ProductCard from '../../components/Products/ProductCard.vue';
import UniversalFilter from '../../components/Common/UniversalFilter.vue'
import Right from '../../components/CascadModels/Right.vue'
import WrapperStickyCurrentObject from '../../components/Widgets/WrapperStickyCurrentObject.vue'
import ProductModal from '../../components/Products/ProductModal.vue'
import SubHeader from '../../components/SubHeader.vue'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'index.vue',
  components: { SubHeader, ProductModal, WrapperStickyCurrentObject, Right, UniversalFilter, ProductCard },
  async mounted() {
    await this.getNextPageData();
    await this.$store.dispatch('NomenclatureModule/getListNomenclature');
    await this.$store.dispatch('NomenclatureModule/getListFavoriteNomenclatureByUserAndObjectId')
  },
  methods: {
    async getNextPageData() {
      const response = await this.$store.dispatch('NomenclatureModule/getListNomenclature', this.$route.query);
      window.history.replaceState({}, '', `/products?cursor=${response.paginationData.cursor}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.products_page_wrapper {
  display: grid;
  row-gap:10px;
  justify-content: center;
  position: relative;
  .current_object_sticky {
    position: absolute;
    right: - 150px;
  }

}
.search_container {
  display: flex;
  grid-column-gap: 1em;

}
</style>
