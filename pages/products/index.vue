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
      <CustomFilters :filters-list="filtersList" :is-loading-filters="isLoadingFilters"/>

      <CustomSelectedParams :is-loading-params="isLoadingParams" :params-data="paramsList"/>
    </div>

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
      {{ $store.getters.statePaginationHasMorePage ? 'Показать еще' : 'Показаны все элементы' }}
    </v-btn>
    <!--    <WrapperStickyCurrentObject class="current_object_sticky"/> -->
  </v-container>
</template>
<script>
import CustomSelectedParams from '../../components/Common/CustomSelectedParams'
import ProductCard from '@/components/Products/ProductCard.vue'
import CustomFilters from '@/components/Common/CustomFilters'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'index.vue',
  // eslint-disable-next-line vue/no-unused-components
  components: {
    CustomSelectedParams,
    ProductCard,
    CustomFilters
  },
  data: () => ({
    /* FILTERS */
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
        key: 'countConters',
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
    // TODO: Request to all filters
    getFilters() {
    },
    getParams() {
    }
  }
}
</script>

<style lang='scss' scoped>
.products_page_wrapper {
  display: grid;
  row-gap: 10px;
  justify-content: center;
  position: relative;
  // TODO: MOBILE VERSION
  max-width: 850px;

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
