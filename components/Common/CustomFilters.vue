<template>
  <div ref="filter-wrapper" class="nomenclature-filter-wrapper">
    <h4 class="nomenclature-filter-wrapper__title">
      Фильтры
    </h4>

    <div v-if="isLoadingFilters || !filtersList.length">
      <ShimmerFilter class="nomenclature-filter-wrapper__items"/>
    </div>

    <div v-else class="nomenclature-filter-wrapper__items">
      <div ref="filter-sort" class="nomenclature-filter-wrapper__items__sort" @click="setFilterStatus">
        <v-icon v-if="filterPriceStatus.key === 'asc' ">
          mdi-sort-variant
        </v-icon>

        <v-icon v-else style="transform: rotate(180deg)">
          mdi-sort-variant
        </v-icon>

        <h5>{{ filterPriceStatus.value }}</h5>
      </div>

      <div
        v-for="(filter, fIndex) in filtersList"
        :key="'filter-' + fIndex"
        :ref="'filter-' + filter.key"
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
                :data="getRangeData(filter.key, 'min')"
                :placeholder="getMinPlaceholder(filter)"
                class="c-input"
                full-sinc-prop
                is-number
                is-outlined
                single-line
                style="width: 133px"
                @update-input="updateSliderData($event, filter.key, 0)"
              />

              <InputStyled
                :data="getRangeData(filter.key, 'max')"
                :placeholder="getMaxPlaceholder(filter)"
                class="c-input"
                full-sinc-prop
                is-number
                is-outlined
                single-line
                style="width: 133px"
                @update-input="updateSliderData($event, filter.key, 1)"
              />
            </div>

            <v-range-slider
              v-model="filterData[filter.key]"
              :max="filter.max"
              :min="filter.min"
              class="align-center"
              hide-details
              @change="updateSliderLine(filter.key)"
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
              class="c-input"
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
              @click="toggleCheckbox(chip.key, filter.key)"
            >
              <v-icon
                v-if="isActive(chip.key, filter.key)"
                class="filter-checkbox__selected__icon"
                color="#8A8784"
                size="14"
              >
                mdi-close-thick
              </v-icon>

              <v-icon
                v-else
                class="filter-checkbox__selected__icon"
                color="#8A8784"
                size="14"
              >
                mdi-plus-thick
              </v-icon>

              {{ chip.name }}
            </v-chip>
          </div>
        </template>

        <!--    INPUT RANGE    -->
        <template v-if="filter.type === 'range'">
          <div class="filter-range">
            <InputStyled
              :data="getRangeData(filter.key, 'min')"
              :is-label="getMinPlaceholder(filter)"
              :max="filter.max"
              :min="filter.min"
              :placeholder="getMinPlaceholder(filter)"
              class="c-input"
              full-sinc-prop
              is-number
              is-outlined
              is-solo
              single-line
              style="width: 133px"
              @update-input="setRangeValue($event, filter.key, 'min')"
            />

            <InputStyled
              :data="getRangeData(filter.key, 'max')"
              :is-label="getMaxPlaceholder(filter)"
              :max="filter.max"
              :min="filter.min"
              :placeholder="getMaxPlaceholder(filter)"
              class="c-input"
              full-sinc-prop
              is-number
              is-outlined
              is-solo
              single-line
              style="width: 133px"
              @update-input="setRangeValue($event, filter.key, 'max')"
            />
          </div>
        </template>
      </div>
    </div>

    <div ref="filter-arrow" :class="{'filter-active-arrow': isActiveArrow}" class="nomenclature-filter-wrapper__arrow">
      <span>Применить</span>
    </div>

    <div class="nomenclature-filter-wrapper__actions">
      <ButtonStyled
        local-class="new-style-btn btn-save"
        local-text="Применить"
        min-height="40"
        min-width="182"
        unset-width
        @click-button="acceptFilters"
      />

      <ButtonStyled
        local-class="new-style-btn btn-cancel"
        local-text="Сбросить"
        min-height="40"
        min-width="182"
        unset-width
        @click-button="resetFilters"
      />
    </div>
  </div>
</template>


<script>
import Vue from 'vue'
import ButtonStyled from '@/components/Common/ButtonStyled'
import ShimmerFilter from '@/components/Shimmers/ShimmerFilter'
import InputStyled from '@/components/Common/InputStyled'
import SearchStyled from '@/components/Common/SearchStyled'

export default {
  name: 'CustomFilters',
  components: { ShimmerFilter, ButtonStyled, SearchStyled, InputStyled },
  props: {
    filtersList: {
      type: Array,
      required: true
    },
    isLoadingFilters: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    /* ARROW */
    isActiveArrow: false,
    arrowKey: '',
    debounceTimeout: null,

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
      ],
      fuel: [
        {
          name: 'Уголь',
          key: 'item1'
        },
        {
          name: 'Газ',
          key: 'item2'
        },
        {
          name: 'Бензин',
          key: 'item3'
        },
        {
          name: 'Керосин',
          key: 'item4'
        }
      ]
    },
    // Selectors loader
    filterLoaderState: {}
  }),
  watch: {
    'filterList': {
      handler(v) {
        this.setSliderDefault()
      },
      deep: true
    }
  },
  mounted() {
    this.setSliderDefault()
  },
  methods: {
    getArrowPosition(key, simpleElem) {
      const searchedElement = simpleElem ? this.$refs[`filter-${key}`] : this.$refs[`filter-${key}`][0]

      if (!searchedElement || !this.$refs['filter-arrow']) {
        return null
      }

      const elem = searchedElement
      return (elem.offsetTop + elem.offsetHeight / 2) - this.$refs['filter-arrow'].offsetHeight / 2
    },
    setArrowPosition(position) {
      if (!this.$refs['filter-arrow'] || !position) {
        return
      }
      this.$refs['filter-arrow'].style.top = position + 'px'
    },
    toggleArrow() {
      this.isActiveArrow = !this.isActiveArrow
    },
    presetArrowPosition(key, position) {
      this.$nextTick(() => {
        if (this.arrowKey !== key) {
          this.arrowKey = key
          this.setArrowPosition(position)
        }

        this.$nextTick(() => {
          if (!this.isActiveArrow) {
            this.toggleArrow()
          }
        })
      })
    },
    arrowLogic(key, simpleElem) {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout)
      this.debounceTimeout = setTimeout(() => {
        const position = this.getArrowPosition(key, simpleElem)

        if (!position) {
          return
        }

        if (this.isActiveArrow && this.arrowKey !== key) {
          this.toggleArrow()

          setTimeout(() => {
            this.presetArrowPosition(key, position)
          }, 700)
        } else {
          this.presetArrowPosition(key, position)
        }
      }, 600)
    },

    setFilterStatus() {
      this.filterPriceStatus = this.filterPriceStatus.key === 'asc' ? this.filterPriceValues[1] : this.filterPriceValues[0]

      this.arrowLogic('sort', true)
    },

    getItems(key) {
      return this.filterSearchedItems[key].filter((elem) => {
        if (!this.filterData[key]) {
          return true
        }
        return !this.filterData[key].map((value) => value.name).includes(elem.name)
      }) ?? []
    },

    setSliderDefault() {
      this.$nextTick(() => {
        const sliders = this.filtersList.filter((elem) => elem.type === 'slider')
        if (sliders.length) {
          sliders.forEach((elem) => {
            Vue.set(this.filterData, elem.key, [elem.min, elem.max])
          })
        }
      })
    },
    getSliderData(key) {
      return this.filterData[key] ?? []
    },
    updateSliderData(value, key, index) {
      if (Array.isArray(this.filterData[key])) {
        Vue.set(this.filterData[key], index, value)
      } else {
        Vue.set(this.filterData, key, [])
        Vue.set(this.filterData[key], index, value)
      }

      this.arrowLogic(key)
    },
    updateSliderLine(key) {
      this.arrowLogic(key)
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

      this.arrowLogic(key)
    },
    removeSelectedElem(index, key) {
      this.filterData[key].splice(index, 1)

      this.arrowLogic(key)
    },

    isActive(value, key) {
      if (!this.filterData[key]) {
        return false
      }

      return this.filterData[key].includes(value)
    },
    toggleCheckbox(value, key) {
      if (!value || !key) {
        return
      }

      this.arrowLogic(key)

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
    },

    getMinPlaceholder(filter) {
      return `от ${filter.min} ${filter?.point ?? ''}`
    },
    getMaxPlaceholder(filter) {
      return `до ${filter.max} ${filter?.point ?? ''}`
    },
    getRangeData(key, condition) {
      if (condition === 'min') {
        return this.filterData[key]?.[0] ?? ''
      } else {
        return this.filterData[key]?.[1] ?? ''
      }
    },
    setRangeValue(value, key, condition) {
      if (!Array.isArray(this.filterData[key])) {
        Vue.set(this.filterData, key, [])
      }

      if (condition === 'min') {
        Vue.set(this.filterData[key], 0, value)
      } else {
        Vue.set(this.filterData[key], 1, value)
      }

      this.arrowLogic(key)
    },

    acceptFilters() {
      if (this.isActiveArrow) {
        this.toggleArrow()
      }
      // eslint-disable-next-line vue/custom-event-name-casing
      this.$emit('acceptFilters', this.filterData)
    },
    resetFilters() {
      if (this.isActiveArrow) {
        this.toggleArrow()
      }

      this.filterData = null
      this.filterData = {}
      this.setSliderDefault()
    }
  }
}
</script>
