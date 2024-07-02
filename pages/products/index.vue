<template>
  <v-container class="products_page_wrapper">
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

    <div class="products-filters">
      <CustomFilters
        ref="filters"
        :filter-data="filterData"
        :filters-list="filtersList"
        :is-loading-filters="isLoadingFilters"
        @acceptFilters="acceptFilters"
        @pushElem="pushElem"
        @removeElem="removeElem"
        @resetFilters="resetFilters"
        @setFilterData="setFilterData"
        @setSliderData="setSliderData"
      />

      <CustomSelectedParams :is-loading-params="isLoadingParams" :params-data="paramsList"/>
    </div>

    <div class="products_page_wrapper__main">
      <SubHeader :additional-breadcrumb="['отопительные котлы']"/>

      <!--   TODO: INLINE STYLE убрать, нужно чистить все файлы со стилями, из-за important. Сейчас это самый быстрый вариант   -->
      <div class="products_page_wrapper__main__input">
        <InputStyled
          :data="searchEquipment"
          :prepend-icon-inner="'mdi-magnify'"
          class="c-input"
          full-sinc-prop
          is-outlined
          single-line
          style="width: 100%; border-radius: 30px !important;"
          @update-input="changeSearchData"
        />
      </div>


      <div class="products_page_wrapper__main__title">
        Отопительные котлы
      </div>

      <div class="tags-wrapper">
        <!--    TODO: transition не работает, похоже v-for шалит    -->
        <transition name="fade">
          <div v-if="restructuredFilterData.length" class="tags-wrapper__tags">
            <div
              v-for="tag in restructuredFilterData"
              :key="'tag-' + tag.key"
              class="tags-wrapper__tags__elem"
            >
              <v-icon
                color="#8A8784"
                size="14"
                @click="removeTag(tag)"
              >
                mdi-close-thick
              </v-icon>
              <div class="tags-wrapper__tags__elem__title">
                {{ tag.name }}
              </div>
            </div>

            <div class="tags-wrapper__tags__reset" @click="resetFilters">
              Сбросить
            </div>
          </div>
        </transition>
      </div>

      <div class="products_page_wrapper__main__products">
        <ProductCard
          v-for="(item) in $store.state.NomenclatureModule.listNomenclature"
          :key="item.id"
          :data="item"
        />
      </div>

      <v-btn
        :disabled="!$store.getters.statePaginationHasMorePage"
        block
        class="mt-5 mb-5 products_page_wrapper__main__button"
        elevation="2"
        outlined
        @click="getNextPageData"
      >
        {{ $store.getters.statePaginationHasMorePage ? 'Показать еще' : 'Показаны все элементы' }}
      </v-btn>
    </div>
    <!--    <WrapperStickyCurrentObject class="current_object_sticky"/> -->
  </v-container>
</template>
<script>
import Vue from 'vue'
import CustomSelectedParams from '../../components/Common/CustomSelectedParams'
import SubHeader from '../../components/SubHeader'
import InputStyled from '../../components/Common/InputStyled'
import ProductCard from '@/components/Products/ProductCard.vue'
import CustomFilters from '@/components/Common/CustomFilters'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'index.vue',
  // eslint-disable-next-line vue/no-unused-components
  components: {
    InputStyled,
    SubHeader,
    CustomSelectedParams,
    ProductCard,
    CustomFilters
  },
  data: () => ({
    /* FILTERS */
    searchEquipment: '',
    filterData: {},
    /* TODO: Убрать моковые данные когда будет бэкенд */
    filtersList: [
      {
        type: 'slider',
        name: 'Цена',
        key: 'price',
        min: 0,
        max: 100,
        point: '₽'
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
            name: 'газовый',
            key: 'steam'
          },
          {
            name: 'жидкотоплевный',
            key: 'liquid'
          },
          {
            name: 'электрический',
            key: 'electric'
          },
          {
            name: 'комбинированный',
            key: 'combi'
          },
          {
            name: 'твердотоплевный',
            key: 'hard'
          }
        ]
      },
      {
        type: 'range',
        name: 'Макс. тепловая мощность',
        key: 'maxThermalPower',
        min: 1,
        max: 250,
        point: 'кВт'
      },
      {
        type: 'checkbox',
        name: 'Количество контуров',
        key: 'countConters',
        items: [
          {
            name: 'одноконтурный',
            key: 'one'
          },
          {
            name: 'двухконтурный',
            key: 'two'
          }
        ]
      },
      {
        type: 'checkbox',
        name: 'Размещение',
        key: 'placement',
        items: [
          {
            name: 'настенный',
            key: 'wall'
          },
          {
            name: 'напольный',
            key: 'floor'
          },
          {
            name: 'парапетный',
            key: 'parapet'
          }
        ]
      },
      {
        type: 'autocomplete',
        name: 'Топливо',
        api: 'test-api',
        key: 'fuel'
      },
      {
        type: 'checkbox',
        name: 'Тип камеры сгорания',
        key: 'typeFuel',
        items: [
          {
            name: 'закрытый',
            key: 'closed'
          },
          {
            name: 'открытый',
            key: 'open'
          }
        ]
      }
    ],
    isLoadingFilters: true,

    /* PARAMS */
    isLoadingParams: true,
    paramsList: [
      {
        name: 'Артикул',
        value: 'value1'
      },
      {
        name: 'Мощность кВт',
        value: 'value2'
      },
      {
        name: 'Вид топлива',
        value: 'value3'
      },
      {
        name: 'Установка',
        value: 'value4'
      },
      {
        name: 'Назначение котла',
        value: 'value5'
      },
      {
        name: 'Камера сгорания',
        value: 'value6'
      },
      {
        name: 'Метериал теплообменника',
        value: 'value7'
      },
      {
        name: 'Габаритные размеры',
        value: 'value8'
      },
      {
        name: 'Срок эксплуатации',
        value: 'value9'
      }
    ]
  }),
  computed: {
    restructuredFilterData() {
      if (this.filterData === null || !Object.keys(this.filterData).length || !this.filtersList.length) {
        return []
      }

      const result = []

      for (const key in this.filterData) {
        const findedFilterList = this.filtersList.find((elem) => elem.key === key)

        if (findedFilterList === null || !Object.keys(findedFilterList).length) {
          return
        }

        if (this.getKeyType[key] === 'slider') {
          if ((this.filterData[key][0] && this.filterData[key][0] !== findedFilterList?.min)) {
            result.push({
              key,
              name: `от ${this.filterData[key][0]}${findedFilterList.point}`,
              index: 0,
              type: this.getKeyType[key]
            })
          }

          if ((this.filterData[key][1] && this.filterData[key][1] !== findedFilterList?.max)) {
            result.push({
              key,
              name: `до ${this.filterData[key][1]}${findedFilterList.point}`,
              index: 1,
              type: this.getKeyType[key]
            })
          }
        }

        if (this.getKeyType[key] === 'autocomplete') {
          this.filterData[key].forEach((elem, index) => {
            result.push({
              key,
              name: elem.name,
              index,
              type: this.getKeyType[key]
            })
          })
        }

        if (this.getKeyType[key] === 'checkbox') {
          this.filterData[key].forEach((elem, index) => {
            result.push({
              key,
              name: elem,
              index,
              type: this.getKeyType[key]
            })
          })
        }

        if (this.getKeyType[key] === 'range') {
          if ((this.filterData[key][0] && this.filterData[key][0] !== findedFilterList?.min)) {
            result.push({
              key,
              name: `от ${this.filterData[key][0]}${findedFilterList.point}`,
              index: 0,
              type: this.getKeyType[key]
            })
          }

          if ((this.filterData[key][1] && this.filterData[key][1] !== findedFilterList?.max)) {
            result.push({
              key,
              name: `до ${this.filterData[key][1]}${findedFilterList.point}`,
              index: 1,
              type: this.getKeyType[key]
            })
          }
        }
      }
      return result
    },
    getKeyType() {
      if (!this.filtersList.length) {
        return {}
      }

      const result = {}

      this.filtersList.forEach((elem) => {
        result[elem.key] = elem.type
      })

      return result
    }
  },
  async mounted() {
    await this.getNextPageData()
    await this.$store.dispatch('NomenclatureModule/getListNomenclature')
    await this.$store.dispatch('NomenclatureModule/getListFavoriteNomenclatureByUserAndObjectId')

    //  TODO: Когда будет api
    //  this.getFilters()
    //  this.getParams()
    this.isLoadingFilters = false
    this.isLoadingParams = false
  },
  methods: {
    async getNextPageData() {
      const response = await this.$store.dispatch('NomenclatureModule/getListNomenclature', this.$route.query)
      window.history.replaceState({}, '', `/products?cursor=${response.paginationData.cursor}`)
    },

    /* FILTERS */
    removeTag(tag) {
      if (tag.type === 'slider' || tag.type === 'range') {
        const findedFilterList = this.filtersList.find((elem) => elem.key === tag.key)

        if (findedFilterList === null || !Object.keys(findedFilterList).length) {
          return
        }

        const oldValues = this.filterData[tag.key]
        this.filterData[tag.key] = []

        if (tag.index === 1) {
          if (tag.type === 'range') {
            Vue.set(this.filterData[tag.key], 1, null)
          } else {
            Vue.set(this.filterData[tag.key], 1, findedFilterList.max)
          }

          Vue.set(this.filterData[tag.key], 0, oldValues[0])
        } else {
          if (tag.type === 'range') {
            Vue.set(this.filterData[tag.key], 1, null)
          } else {
            Vue.set(this.filterData[tag.key], 0, findedFilterList.min)
          }

          Vue.set(this.filterData[tag.key], 1, oldValues[1])
        }
      } else {
        this.filterData[tag.key].splice(tag.index, 1)
      }
    }
    ,
    changeSearchData(value) {
      this.searchEquipment = value
    }
    ,
    setSliderData({ key, value }) {
      Vue.set(this.filterData, key, value)
    }
    ,
    setFilterData({ key, index, value }) {
      if (index !== undefined) {
        Vue.set(this.filterData[key], index, value)
      } else {
        Vue.set(this.filterData, key, value)
      }
    }
    ,
    pushElem({ key, value }) {
      this.filterData[key].push(value)
    }
    ,
    removeElem({ key, index }) {
      this.filterData[key].splice(index, 1)
    }
    ,
    resetFilters() {
      this.isLoadingFilters = true
      this.filterData = null
      this.filterData = {}

      this.$nextTick(() => {
        this.$refs.filters.setSliderDefault()
        this.$refs.filters.hideArrow()

        this.isLoadingFilters = false
      })
    }
    ,
    acceptFilters() {
      //  TODO: ACCEPT FILTERS
    }
    ,
    // TODO: Request to all filters
    getFilters() {
    }
    ,
    getParams() {
    }
  }
}
</script>

<style lang='scss' scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.products_page_wrapper {
  display: flex;
  justify-content: center;
  position: relative;
  // TODO: MOBILE VERSION
  max-width: 850px;

  .current_object_sticky {
    position: absolute;
    right: - 150px;
  }

  &__main {
    display: flex;
    flex-direction: column;
    flex: 1;

    &__input {
      margin-left: 32px;
      background: white;
      margin-bottom: 30px;
      border-radius: 30px;
    }

    &__title {
      font-size: 24px;
      font-weight: 700;
      line-height: 28.13px;
      color: #000000;
      margin-bottom: 10px;
      padding-left: 32px;
    }

    &__products {
      display: flex;
      flex-direction: column;
      row-gap: 10px;
    }

    &__button {
      max-height: 36px;
    }
  }
}

.tags-wrapper {
  min-height: 16px;
  margin-bottom: 10px;
  padding-left: 32px;

  &__tags {
    display: flex;
    align-items: center;
    column-gap: 10px;
    row-gap: 10px;
    flex-wrap: wrap;

    &__elem {
      display: flex;
      column-gap: 2px;
      align-items: center;
      justify-content: center;

      &__title {
        font-size: 12px;
        font-weight: 500;
        line-height: 14px;
        color: #8A8784;
      }
    }

    &__reset {
      font-size: 12px;
      font-weight: 500;
      line-height: 14px;
      color: #B1AEAC;
      cursor: pointer;
      margin-left: 20px;
    }
  }
}

.search_container {
  display: flex;
  grid-column-gap: 1em;

}
</style>
