<template>
  <div :class="{'hovered-widget': getIsAnswered}" class="w-slider-wrapper">
    <div class="w-slider-wrapper-label">
      <v-badge
        :content="getVisibleNomenclature"
        :value="getVisibleNomenclature"
        color="#95D7AE"
      >
        Рекомендуемое оборудование
      </v-badge>
    </div>
    <div class="w-slider-wrapper-separator"/>

    <div class="w-slider-wrapper-slider-container">
      <VueSlickCarousel
        v-if="nomenclatureList.length"
        ref="v-carousel"
        v-bind="sliderOptions"
        @beforeChange="changeSlide"
        @init="onInitCarousel"
      >
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
                <template v-else>
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
      <template v-if="getCurrentNomenclature.isLoading">
        <ShimmerNomenclatureWidget/>
      </template>

      <template v-else-if="!getCurrentNomenclature || !Object.keys(getCurrentNomenclature).length">
        <span class="c-slider-error">Ошибка получения данных</span>

        <v-icon class="mt-1" color="orange">
          mdi-alert
        </v-icon>
      </template>

      <template v-else>
        <div class="w-slider-wrapper-info__wrapper">
          <div class="w-slider-wrapper-info__wrapper__label">
            {{ getCurrentNomenclature.data.name }}
          </div>

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
                >{{ getCurrentNomenclature.data[option.value] ? getCurrentNomenclature.data[option.value] : mockData[option.value]
                }}</span>
              </span>
            </li>
          </ul>

          <div class="w-slider-wrapper-info__wrapper__bot">
            <ButtonStyled
              :local-class="'style_button widget-button more-button'"
              :local-text="'Подробнее'"
              unset-width
              @click-button="onCLickNomenclature"
            />

            <AddToFavoriteNomenclatures
              :favorite-object="favoriteData"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel';
import 'vue-slick-carousel/dist/vue-slick-carousel.css';
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css';
import ShimmerNomenclatureWidget from '../Shimmers/ShimmerNomenclatureWidget';
import ButtonStyled from '../Common/ButtonStyled';
import AddToFavoriteNomenclatures from '../Common/AddToFavoriteNomenclatures.vue';

import Request from '@/services/request';
import { FavoriteNomenclature } from '~/helpers/constructors';

export default {
  name: 'NomenclatureWidget',
  components: {
    ButtonStyled,
    ShimmerNomenclatureWidget,
    VueSlickCarousel,
    AddToFavoriteNomenclatures
},
  data: () => ({
    nomenclatureList: [
      {
        isLoading: true,
        hide: true,
        data: null
      },
      {
        isLoading: true,
        hide: true,
        data: null
      },
      {
        isLoading: true,
        hide: true,
        data: null
      }
    ],
    currentNomenclatureIndex: 0,

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
    },
  }),
  computed: {
    getIsAnswered() {
      return this.$store.state.ArticleModule.isAnswered;
    },
    checkIsFavorite() {
      if (!this.getCurrentNomenclature || !Object.keys(this.getCurrentNomenclature).length) {
        return false;
      }
      return this.getCurrentNomenclature?.isLiked;
    },
    getVisibleNomenclature() {
      return this.nomenclatureList.filter((elem) => !elem?.hide).length;
    },
    getCurrentNomenclature() {
      if (!this.nomenclatureList.length) {
        return {};
      }

      if (this.currentNomenclatureIndex > this.nomenclatureList) {
        return this.nomenclatureList[0] ?? {};
      }

      return this.nomenclatureList[this.currentNomenclatureIndex];
    },
    favoriteData(){
      return new FavoriteNomenclature(
        this.$store.getters['Objects/getIdCurrentObject'],
        this.$store.getters.getUserId,
        this.getCurrentNomenclature.data.id
      )
    }
  },
  watch: {
    'getIsAnswered': {
      handler(v) {
        if (v) {
          this.resetData();
          this.getNomenclature('start');
        }
      }
    },
    '$store.state.Objects.currentObject.id':{
      async handler(idCurrentObject) {
        if (!idCurrentObject) return false;

        await this.$store.dispatch('NomenclatureModule/getListFavoriteNomenclatureByUserAndObjectId');
      }
    }
  },
  async mounted() {
    await this.$store.dispatch('NomenclatureModule/getListNomenclature');
    this.getNomenclature('start');
  },
  methods: {
    getPhoto(slide) {
      const url = (slide?._family?.photos && slide?._family?.photos[0]) ?? null;

      if (url) {
        return this.$store.state.BASE_URL + url?.full_path;
      } else {
        return null;
      }
    },
    async getNomenclature(type) {
      // TODO переделать на эндпоинт в store store/modules/nomenclature/index.js - getListNomenclature
      const url = this.$store.state.BASE_URL + '/entity/nomenclature';
      const { data } = await Request.get(url);

      if (type === 'start') {
        this.nomenclatureList = data.map((elem, index) => {
          return { isLoading: false, data: elem, isLiked: false };
        });
      }

      if (type === 'nextPage') {
        const transformedArr = data.map((elem) => {
          return { isLoading: false, data: elem, isLiked: false };
        });
        this.nomenclatureList.push(...transformedArr);
      }
    },
    resetData() {
      this.nomenclatureList = [
        {
          isLoading: true,
          hide: true,
          data: null
        },
        {
          isLoading: true,
          hide: true,
          data: null
        },
        {
          isLoading: true,
          hide: true,
          data: null
        }
      ];

      this.currentNomenclatureIndex = 0;
    },

    onInitCarousel() {
      if (process.client) {
        this.$nextTick(() => {
        });
      }
    },
    changeSlide(oldSlideIndex, newSliderIndex) {
      this.currentNomenclatureIndex = newSliderIndex;

      if (newSliderIndex === this.nomenclatureList.length - 2) {
        this.getNomenclature('nextPage');
      }
    },

    // onClickLike() {
    //   // TODO: Функционал лайков
    //   this.getCurrentNomenclature.isLiked = !this.getCurrentNomenclature.isLiked;
    // },

    onCLickNomenclature() {
    }
  }
};
</script>
