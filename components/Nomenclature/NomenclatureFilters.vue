<template>
  <div class="nomenclature-filter-wrapper">
    <h4 class="nomenclature-filter-wrapper__title">
      Фильтры
    </h4>

    <div class="nomenclature-filter-wrapper__items">
      <div class="nomenclature-filter-wrapper__items__sort">
        <v-icon>mdi-sort-variant</v-icon>

        <h5>{{ filterPriceStatus.value }}</h5>
      </div>

      <div
        v-for="(filter, fIndex) in filtersList"
        :key="'filter-' + fIndex"
        class="nomenclature-filter-wrapper__items__elem"
      >
        <h5 class="nomenclature-filter-wrapper__items__elem__title">
          {{ filter.name }}
        </h5>

        <!--    SLIDER    -->
        <template v-if="filter.type === 'slider'">
          <div class="filter-slider">
            <div class="filter-slider__inputs">
              <InputStyled
                :data="filter.value[0]"
                full-sinc-prop
                is-number
                is-solo
                single-line
                style="width: 133px"
                @update-input="$set(filter.value, 0, $event)"
              />

              <InputStyled
                :data="filter.value[1]"
                full-sinc-prop
                is-number
                is-solo
                single-line
                style="width: 133px"
                @update-input="$set(filter.value, 1, $event)"
              />
            </div>

            <v-range-slider
              v-model="filter.value"
              :max="filter.max"
              :min="filter.min"
              class="align-center"
              hide-details
            />
          </div>
        </template>

        <!--    AUTOCOMPLETE    -->
        <template v-if="filter.type === 'autocomplete'">
          <SearchStyled
            :is-class="'styleSearch'"
            :is-item-text="'text'"
            :is-item-value="'text'"
            :is-items="getItems(filter.key)"
            :is-loading="$store.state.PopularSelectionsModule.loadingState"
            :is-placeholder="'Найти'"
            clear-after-select
            is-hide-selected
            @update-search-input="getElemList(filter.api, filter.key)"
            @select-item="selectItem($event, filter.key)"
          />
        </template>

        <!--    SELECT    -->
        <template v-if="filter.type === 'select'">
          <div/>
        </template>
      </div>
    </div>

    <div class="nomenclature-filter-wrapper__actions"/>
  </div>
</template>

<script>
import InputStyled from '@/components/Common/InputStyled'
import SearchStyled from '@/components/Common/SearchStyled'

export default {
  name: 'NomenclatureFilters',
  components: { SearchStyled, InputStyled },
  data: () => ({
    filterPriceStatus: {
      key: 'asc',
      value: 'Сначала недорогие'
    },
    filterPriceValues: [
      {
        key: 'asc',
        value: 'Сначала недорогие'
      },
      {
        key: 'desc',
        value: 'Сначала дорогие'
      }
    ],

    filtersList: [
      {
        type: 'slider',
        name: 'Цена',
        value: [0, 100],
        key: 'price',
        min: 0,
        max: 100
      }
    ],
    filterSearchedItems: {},
  }),
  methods: {
    getItems(key) {
      return this.filterSearchedItems[key] ?? []
    },

    getElemList(api, key) {
      const result = []
      this.filterSearchedItems[key] = result
    },
    selectItem(value, key) {

    }
  }
}
</script>

<style scoped>

</style>
