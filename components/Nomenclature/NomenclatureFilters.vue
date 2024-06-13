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
      </div>
    </div>

    <div class="nomenclature-filter-wrapper__actions"/>
  </div>
</template>

<script>
import InputStyled from '../Common/InputStyled'

export default {
  name: 'NomenclatureFilters',
  components: { InputStyled },
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
        min: 0,
        max: 100
      }
    ]
  })
}
</script>

<style scoped>

</style>
