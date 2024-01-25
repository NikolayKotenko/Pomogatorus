<template>
  <div class="w-slider-wrapper">
    <div class="w-slider-wrapper-label">
      Оборудование
    </div>
    <div class="w-slider-wrapper-separator"/>

    <div class="w-slider-wrapper-slider-container">
      <VueSlickCarousel v-if="nomenclatureList.length" v-bind="sliderOptions" @click.stop.prevent>
        <div
          v-for="(slide, index) in nomenclatureList"
          :key="index"
          class="w-slider-nomenclature"
          draggable="false"
        >
          <div class="w-slider-nomenclature__slide" draggable="false">
            <!--     LOADER STATE     -->
            <template v-if="slide.isLoading">
              <div class="w-slider-nomenclature__slide__loader">
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
                class="w-slider-nomenclature__slide__content"
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
            </template>
          </div>
        </div>
      </VueSlickCarousel>
    </div>

    <div class="w-slider-wrapper-info">
      <template v-if="isLoadingDetail">
        <ShimmerNomenclatureWidget/>
      </template>

      <template v-else-if="!currentNomenclature || !Object.keys(currentNomenclature).length">
        <span class="c-slider-error">Ошибка получения данных</span>

        <v-icon class="mt-1" color="orange">
          mdi-alert
        </v-icon>
      </template>

      <template v-else>
        <div class="w-slider-wrapper-info__wrapper">
          <div class="w-slider-wrapper-info__wrapper__label"/>

          <ul class="w-slider-wrapper-info__wrapper__list">
            <li
              v-for="(option, index) in cardFields"
              :key="index"
              class="w-slider-wrapper-info__wrapper__list__options"
            >
              <span class="w-slider-option">
                <span class="w-slider-option__label">{{ option.label }}: </span>
                <span
                  class="w-slider-option__value"
                >{{ currentNomenclature.data[option.value] ? currentNomenclature.data[option.value] : mockData[option.value]
                }}</span>
              </span>
            </li>
          </ul>

          <div class="w-slider-wrapper-info__wrapper__bot">
            <ButtonStyled
              :local-class="'style_button'"
              :local-text="'Подробнее'"
              @click-button="onCLickNomenclature"
            />

            <ButtonStyled
              :local-class="checkIsFavorite ? 'style_button' : ''"
              @click-button="onClickLike"
            >
              <v-icon :color="checkIsFavorite ? '#95D7AE' : 'gray'">
                mdi-heart
              </v-icon>
            </ButtonStyled>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import ShimmerNomenclatureWidget from '../Shimmers/ShimmerNomenclatureWidget'
import ButtonStyled from '../Common/ButtonStyled'

export default {
  name: 'NomenclatureWidget',
  components: {
    ButtonStyled,
    ShimmerNomenclatureWidget,
    VueSlickCarousel
  },
  data: () => ({
    nomenclatureList: [
      {
        isLoading: true,
        data: null
      },
      {
        isLoading: true,
        data: null
      },
      {
        isLoading: true,
        data: null
      }
    ],
    currentNomenclature: {},
    isLoadingDetail: true,

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
      'slidesToShow': 1,
      'slidesToScroll': 1,
      'initialSlide': 0
    }
  }),
  computed: {
    checkIsFavorite() {
      return false
    }
  },
  methods: {
    getPhoto(slide) {
      const url = (slide?._family?.photos && slide?._family?.photos[0]) ?? null

      if (url) {
        return this.$store.state.BASE_URL + url
      } else {
        return null
      }
    },

    onClickLike() {
    },
    onCLickNomenclature() {
    }
  }
}
</script>
