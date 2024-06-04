<template>
  <div
    :id="`component_wrapper-${index_component}`"
    :data-id="dataId"
    class="componentArticle_wrapper c-slider-wrapper component_container"
    contenteditable="false"
    data-name="nomenclature"
  >
    <VueSlickCarousel v-if="nomenclatureList.length" v-bind="sliderOptions" @click.stop.prevent>
      <div
        v-for="(slide, index) in nomenclatureList"
        :key="index"
        :data-id="slide.id"
        class="c-slide"
        draggable="false"
      >
        <div class="c-slider" draggable="false">
          <!--     LOADER STATE     -->
          <template v-if="slide.isLoading">
            <div class="c-slider__loader">
              <v-progress-circular
                v-if="slide.isLoading"
                :size="24"
                color="#539ee0"
                indeterminate
              />
            </div>
          </template>

          <!--     ERROR STATE     -->
          <template v-else-if="!slide.data">
            <span class="c-slider-error">Ошибка получения данных</span>

            <v-icon class="mt-1" color="orange">
              mdi-alert
            </v-icon>
          </template>

          <!--     SUCCESS STATE     -->
          <template v-else>
            <NomenclatureCard :nomenclature-data="slide" @click="onCLickNomenclature"/>
          </template>
        </div>
      </div>
    </VueSlickCarousel>
  </div>
</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel'
import NomenclatureCard from '../Nomenclature/NomenclatureCard'
import constructFilterQuery from '~/utils/constructFilterQuery'
import Request from '@/services/request'

import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

export default {
  name: 'NomenclatureArticle',
  components: {
    NomenclatureCard,
    VueSlickCarousel
  },
  data: () => ({
    index_component: null,
    index_nomenclature: null,
    nomenclature_data: {},
    nomenclatureList: [],

    mockData: {
      montage: 'настенный',
      fuel: 'газ',
      power: '10 кВт'
    },
    cardFields: [
      {
        label: 'Монтаж',
        value: 'montage'
      },
      {
        label: 'Вид топлива',
        value: 'fuel'
      },
      {
        label: 'Мощность',
        value: 'power'
      }
    ],
    sliderOptions: {
      'dots': false,
      'infinite': true,
      'speed': 500,
      'slidesToShow': 3,
      'slidesToScroll': 3,
      'variableWidth': true,
      'responsive': [
        {
          'breakpoint': 1024,
          'settings': {
            'slidesToShow': 3,
            'slidesToScroll': 3
          }
        },
        {
          'breakpoint': 768,
          'settings': {
            'slidesToShow': 2,
            'slidesToScroll': 2,
            'variableWidth': false
          }
        },
        {
          'breakpoint': 480,
          'settings': {
            'slidesToShow': 1,
            'slidesToScroll': 1,
            'variableWidth': false
          }
        }
      ]
    }
  }),
  computed: {
    dataId() {
      if (!this.nomenclature_data || !this.nomenclature_data?.id) return null
      return this.nomenclature_data.id
    }
  },
  mounted() {
    this.getData()
    this.getNomenclatureInfo()
  },
  methods: {
    /* GET INFO NOMENCLATURE */
    getData() {
      if (
        Object.keys(this.$store.state.ArticleModule.selectedComponent).length
      ) {
        this.index_component = this.$store.state.ArticleModule.countLayout
        this.nomenclature_data = Object.assign(
          {},
          this.$store.state.ArticleModule.selectedComponent
        )

        this.nomenclatureList = this.nomenclature_data.nomenclatures_id.map(elem => {
          return { id: elem, isLoading: true }
        })
      }
    },
    async getNomenclatureInfo() {
      const values = []
      
      this.nomenclatureList.map(elem => elem.id).filter((value, index, array) => array.indexOf(value) === index).forEach((elem) => {
        values.push({ ids_nomenclatures: elem })
      })

      const query = constructFilterQuery(values, true)

      const result = await Request.get(
        `${this.$store.state.BASE_URL}/entity/nomenclature${query}`
      )

      console.log('RESULT', result)

      // this.nomenclatureList.forEach(async (elem) => {
      //   const result = await Request.get(
      //     `${this.$store.state.BASE_URL}/entity/nomenclature/${elem.id}`
      //   )
      //
      //   elem.data = result?.data ?? null
      //   elem.isLoading = false
      // })
    },
    getPhoto(slide) {
      const url = (slide?._family?.photos && slide?._family?.photos[0]) ?? null

      if (url) {
        return this.$store.state.BASE_URL + url?.full_path
      } else {
        return null
      }
    },
    onCLickNomenclature() {
    }
  }
}
</script>

<style lang='scss'>
.c-slider-wrapper {
  .slick-track {
    //display: flex !important;
    //column-gap: 20px !important;
  }

  .slick-slide {
    //display: flex !important;
    //align-items: center !important;
    //justify-content: center !important;
    //margin: 0 10px;
  }
}
</style>
