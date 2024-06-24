<template>
  <div class="nomenclature-filter-wrapper">
    <h4 class="nomenclature-filter-wrapper__title">
      Фильтры
    </h4>

    <div v-if="isLoadingFilters">
      <!--   TODO: Shimmers   -->
    </div>

    <div v-else class="nomenclature-filter-wrapper__items">
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
                :data="filterData[filter.key][0]"
                full-sinc-prop
                is-number
                is-solo
                single-line
                style="width: 133px"
                @update-input="$set(filterData[filter.key], 0, $event)"
              />

              <InputStyled
                :data="filterData[filter.key][1]"
                full-sinc-prop
                is-number
                is-solo
                single-line
                style="width: 133px"
                @update-input="$set(filterData[filter.key], 1, $event)"
              />
            </div>

            <v-range-slider
              v-model="filterData[filter.key]"
              :max="filter.max"
              :min="filter.min"
              class="align-center"
              hide-details
            />
          </div>
        </template>

        <!--    AUTOCOMPLETE    -->
        <template v-if="filter.type === 'autocomplete'">
          <div class="filter-autocomplete">
            <SearchStyled
              :is-class="'styleSearch'"
              :is-item-text="'name'"
              :is-item-value="'key'"
              :is-items="getItems(filter.key)"
              :is-loading="!!filterLoaderState[filter.key]"
              :is-placeholder="'Найти'"
              always-show
              clear-after-select
              is-persistent-placeholder
              @update-search-input="getElemList(filter.api, filter.key)"
              @select-item="selectElem($event, filter.key)"
            />

            <div class="filter-autocomplete__selected">
              <v-chip
                v-for="(chip, cIndex) in filterData[filter.key]"
                :key="'chip-' + cIndex"
                class="c-chip c-chip-active"
              >
                <v-icon
                  class="filter-autocomplete__selected__icon"
                  color="#8A8784"
                  size="14"
                  @click="removeSelectedElem(cIndex, filter.key)"
                >
                  mdi-close-thick
                </v-icon>

                {{ chip.name }}
              </v-chip>
            </div>
          </div>
        </template>

        <!--    SELECT    -->
        <template v-if="filter.type === 'checkbox'">
          <div class="filter-checkbox">
            <v-chip
              v-for="(chip, cIndex) in filter.items"
              :key="'checkbox-' + cIndex"
              :class="{'c-chip-active': isActive(chip.key, filter.key)}"
              class="c-chip c-chip-inactive"
            >
              <v-icon
                v-if="isActive(chip.key, filter.key)"
                class="filter-checkbox__selected__icon"
                color="#8A8784"
                size="14"
                @click="toggleCheckbox(chip.key, filter.key)"
              >
                mdi-close-thick
              </v-icon>

              <v-icon
                v-else
                class="filter-checkbox__selected__icon"
                color="#8A8784"
                size="14"
                @click="toggleCheckbox(chip.key, filter.key)"
              >
                mdi-plus-thick
              </v-icon>

              {{ chip.name }}
            </v-chip>
          </div>
        </template>
      </div>
    </div>

    <div class="nomenclature-filter-wrapper__actions"/>
  </div>
</template>

<script>
import Vue from 'vue'
import InputStyled from '@/components/Common/InputStyled'
import SearchStyled from '@/components/Common/SearchStyled'

export default {
  name: 'NomenclatureFilters',
  components: { SearchStyled, InputStyled },
  data: () => ({
    isLoadingFilters: true,

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

    // Selected filters by user
    filterData: {},
    // All filters from DB
    filtersList: [
      {
        type: 'slider',
        name: 'Цена',
        key: 'price',
        min: 0,
        max: 100
      },
      {
        type: 'autocomplete',
        name: 'Бренд',
        api: 'test-api',
        key: 'brand'
      },
      {
        type: 'checkbox',
        name: 'Тип отопительного котла',
        key: 'typeKotla',
        items: [
          {
            name: 'Газовый',
            key: 'steam'
          },
          {
            name: 'Жидкотоплевный',
            key: 'liquid'
          },
          {
            name: 'Электрический',
            key: 'electric'
          },
          {
            name: 'Комбинированный',
            key: 'combi'
          },
          {
            name: 'Твердотоплевный',
            key: 'hard'
          }
        ]
      }
    ],
    // Selectors items from request
    filterSearchedItems: {
      brand: [
        {
          name: 'Baxi 1',
          key: 'item1'
        },
        {
          name: 'Baxi 2',
          key: 'item2'
        },
        {
          name: 'Baxi 3',
          key: 'item3'
        },
        {
          name: 'Baxi long text shown',
          key: 'item4'
        },
        {
          name: 'Very very big textVery very big text',
          key: 'item5'
        },
        {
          name: 'Русское название',
          key: 'item6'
        }
      ]
    },
    // Selectors loader
    filterLoaderState: {}
  }),
  mounted() {
    //  TODO: Когда будет api
    //  this.getFilters()
    Vue.set(this.filterData, 'price', [this.filtersList[0].min, this.filtersList[0].max])
    this.isLoadingFilters = false
  },
  methods: {
    // TODO: Request to all filters
    getFilters() {
    },

    getItems(key) {
      return this.filterSearchedItems[key].filter((elem) => {
        if (!this.filterData[key]) {
          return true
        }
        return !this.filterData[key].map((value) => value.name).includes(elem.name)
      }) ?? []
    },

    getElemList(api, key) {
      // TODO: Request to items in selectors
      // const result = []
      // console.log(api, key)
      // Vue.set(this.filterSearchedItems, key, result)
    },
    selectElem(value, key) {
      if (!value || !key) {
        return
      }

      if (Array.isArray(this.filterData[key])) {
        this.filterData[key].push(value)
      } else {
        Vue.set(this.filterData, key, [value])
      }
    },
    removeSelectedElem(index, key) {
      this.filterData[key].splice(index, 1)
    },

    isActive(value, key) {
      if (!this.filterData[key]) {
        return false
      }

      console.log(this.filterData[key].includes(value))

      return this.filterData[key].includes(value)
    },
    toggleCheckbox(value, key) {
      if (!value || !key) {
        return
      }

      if (!Array.isArray(this.filterData[key])) {
        Vue.set(this.filterData, key, [value])
        return
      }

      if (this.filterData[key].includes(value)) {
        const index = this.filterData[key].findIndex(elem => elem === value)

        if (index !== -1) {
          this.filterData[key].splice(index, 1)
        }

      } else {
        this.filterData[key].push(value)
      }
    }
  }
}
</script>

<style scoped>

</style>
