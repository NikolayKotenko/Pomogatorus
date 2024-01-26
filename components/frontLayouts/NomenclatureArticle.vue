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
            <div
              class="c-slider__content"
              draggable="false"
            >
              <template v-if="getPhoto(slide.data)">
                <img :alt="slide.data.name" :src="getPhoto(slide.data)">
              </template>

              <!--     NO PHOTO     -->
              <template>
                <img :alt="slide.data.name" draggable="false" src="https://baxi.ru/photo/ECO_Nova_004.png">
              </template>
              <!--     TODO: Убрать моковую картинку         -->
              <!--              <template> -->
              <!--                <img :alt="slide.data.name" :src="require('~/assets/images/noImage.webp')"> -->
              <!--              </template> -->
            </div>

            <!--     INFO     -->
            <div class="c-slider__info">
              <h4 class="c-slider__info__label">
                {{ slide.data.name }}
              </h4>

              <div class="c-slider__info__wrapper">
                <!--     HOVER INFO     -->
                <div class="c-slider__info__wrapper__left">
                  <div
                    v-for="(option, index) in cardFields"
                    :key="index"
                    class="c-slider__info__wrapper__left__options"
                  >
                    <span class="c-slider-option">
                      <span class="c-slider-option__label">{{ option.label }}: </span>
                      <span
                        class="c-slider-option__value"
                      >{{ slide.data[option.value] ? slide.data[option.value] : mockData[option.value] }}</span>
                    </span>
                  </div>
                </div>

                <!--     CLICK ICONS     -->
                <div class="c-slider__info__wrapper__right">
                  <TooltipStyled
                    :title="'Добавить в избранное'"
                  >
                    <v-icon
                      color="#ffffff"
                      large
                      @click="changeFavoriteProduct"
                    >
                      mdi-star-outline
                    </v-icon>
                  </TooltipStyled>

                  <TooltipStyled
                    :title="'Добавить в купленное'"
                  >
                    <v-icon
                      color="#ffffff"
                      large
                      @click="addBoughtProduct"
                    >
                      mdi-cart-check
                    </v-icon>
                  </TooltipStyled>

                  <TooltipStyled
                    :title="'Добавить в установленное'"
                  >
                    <v-icon
                      color="#ffffff"
                      large
                      @click="addInstalledProduct"
                    >
                      mdi-wrench-check-outline
                    </v-icon>
                  </TooltipStyled>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </VueSlickCarousel>
  </div>
</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel'
import TooltipStyled from '../Common/TooltipStyled.vue'

import Request from '@/services/request'

import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

export default {
  name: 'NomenclatureArticle',
  components: {
    VueSlickCarousel,
    TooltipStyled
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
      'slidesToShow': 4,
      'slidesToScroll': 4,
      'initialSlide': 0,
      'responsive': [
        {
          'breakpoint': 1024,
          'settings': {
            'slidesToShow': 3,
            'slidesToScroll': 3,
            'infinite': true
          }
        },
        {
          'breakpoint': 600,
          'settings': {
            'slidesToShow': 2,
            'slidesToScroll': 2,
            'initialSlide': 2
          }
        },
        {
          'breakpoint': 480,
          'settings': {
            'slidesToShow': 1,
            'slidesToScroll': 1
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
    getNomenclatureInfo() {
      this.nomenclatureList.forEach(async (elem) => {
        const result = await Request.get(
          `${this.$store.state.BASE_URL}/entity/nomenclature/${elem.id}`
        )

        elem.data = result?.data ?? null
        elem.isLoading = false
      })
    },
    getPhoto(slide) {
      const url = (slide?._family?.photos && slide?._family?.photos[0]) ?? null

      if (url) {
        return this.$store.state.BASE_URL + url
      } else {
        return null
      }
    },

    /* ACTIONS */
    changeFavoriteProduct() {
      this.$toast.success('Добавленно в избранное', { duration: 5000 })
    },
    addBoughtProduct() {
      this.$toast.success('Добавленно в купленное', { duration: 5000 })
    },
    addInstalledProduct() {
      this.$toast.success('Добавленно в установленное', { duration: 5000 })
    }
  }
}
</script>
