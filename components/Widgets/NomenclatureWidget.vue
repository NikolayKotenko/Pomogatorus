<template>
  <!--  <div class="widget_wrapper"> -->
  <!--    <NomenclatureCard -->
  <!--      v-for="(slide, index) in $store.dispatch('NomenclatureModule/getListNomenclature')" -->
  <!--      :key="index" -->
  <!--      :nomenclature-data="slide" -->
  <!--    /> -->
  <!--  </div> -->
  <!--  <div class="nomenclature_widget_wrapper"> -->
  <!--    <VueSlickCarousel -->
  <!--      v-bind="sliderOptions" -->
  <!--    > -->
  <!--      <div -->
  <!--        v-for="(slide, index) in nomenclatureList" -->
  <!--        :key="index" -->
  <!--      > -->
  <!--        <NomenclatureCard :nomenclature-data="slide"/> -->
  <!--      </div> -->
  <!--    </VueSlickCarousel> -->
  <!--  </div> -->
  <div class="w-slider-wrapper">
    <div class="w-slider-wrapper-slider-container">
      <VueSlickCarousel
        v-if="$store.state.NomenclatureModule.listNomenclature"
        :key="$route.fullPath"
        v-bind="sliderOptions"
      >
        <div
          v-for="(slide, index) in $store.state.NomenclatureModule.listNomenclature"
          :key="index"
          class="w-slider-nomenclature"
        >
          <NomenclatureCard :nomenclature-data="slide" no-info/>
        </div>
      </VueSlickCarousel>
    </div>

    <!--    <div class="w-slider-wrapper-info"> -->
    <!--      <template v-if="getCurrentNomenclature.isLoading"> -->
    <!--        <ShimmerNomenclatureWidget/> -->
    <!--      </template> -->

    <!--      <template v-else-if="!getCurrentNomenclature || !Object.keys(getCurrentNomenclature).length"> -->
    <!--        <span class="c-slider-error">Ошибка получения данных</span> -->

    <!--        <v-icon class="mt-1" color="orange"> -->
    <!--          mdi-alert -->
    <!--        </v-icon> -->
    <!--      </template> -->

    <!--      <template v-else> -->
    <!--        <div class="w-slider-wrapper-info__wrapper"> -->
    <!--          <div class="w-slider-wrapper-info__wrapper__label"> -->
    <!--            {{ getCurrentNomenclature.data.name }} -->
    <!--          </div> -->
    <!--        </div> -->
    <!--      </template> -->
    <!--    </div> -->
  </div>
</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel';
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

import NomenclatureCard from '../Nomenclature/NomenclatureCard'
import ShimmerNomenclatureWidget from '../Shimmers/ShimmerNomenclatureWidget'
import Request from '@/services/request'

export default {
  name: 'NomenclatureWidget',
  components: {
    ShimmerNomenclatureWidget,
    NomenclatureCard,
    VueSlickCarousel
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
      'dots': true,
      'infinite': false,
      'arrows': false,
      'speed': 500,
      'slidesToShow': 3,
      'slidesToScroll': 3,
    }
  }),
  computed: {
    getIsAnswered() {
      return this.$store.state.ArticleModule.isAnswered
    },
    getVisibleNomenclature() {
      return this.nomenclatureList.filter((elem) => !elem?.hide).length
    },
    getCurrentNomenclature() {
      if (!this.nomenclatureList.length) {
        return {}
      }

      if (this.currentNomenclatureIndex > this.nomenclatureList) {
        return this.nomenclatureList[0] ?? {}
      }

      return this.nomenclatureList[this.currentNomenclatureIndex]
    }
  },
  watch: {
    'getIsAnswered': {
      handler(v) {
        if (v) {
          this.resetData()
          this.getNomenclature('start')
        }
      }
    },
    '$store.state.Objects.currentObject.id':{
      async handler(idCurrentObject) {
        if (!idCurrentObject) return false;

        await this.$store.dispatch('NomenclatureModule/getListFavoriteNomenclatureByUserAndObjectId');
      }
    },
    '$store.getters.stateAuth': {
      async handler(v) {
        await this.$store.dispatch('NomenclatureModule/getListNomenclature')
      }
    }
  },
  async mounted() {
    await this.$store.dispatch('NomenclatureModule/getListNomenclature')
    // this.getNomenclature()
  },
  methods: {
    // async getNomenclature() {
      // // TODO переделать на эндпоинт в store store/modules/nomenclature/index.js - getListNomenclature
      // const url = this.$store.state.BASE_URL + '/entity/nomenclature'
      // const { data } = await Request.get(url)
      //
      // if (type === 'start') {
      //   this.nomenclatureList = data.map((elem, index) => {
      //     return { isLoading: false, data: elem, isLiked: false }
      //   })
      // }
      //
      // if (type === 'nextPage') {
      //   const transformedArr = data.map((elem) => {
      //     return { isLoading: false, data: elem, isLiked: false }
      //   })
      //   this.nomenclatureList.push(...transformedArr)
      // }

    // resetData() {
    //   this.nomenclatureList = [
    //     {
    //       isLoading: true,
    //       hide: true,
    //       data: null
    //     },
    //     {
    //       isLoading: true,
    //       hide: true,
    //       data: null
    //     },
    //     {
    //       isLoading: true,
    //       hide: true,
    //       data: null
    //     }
    //   ]
    //
    //   this.currentNomenclatureIndex = 0
    // },

    onInitCarousel() {
      if (process.client) {
        this.$nextTick(() => {
        })
      }
    },
    changeSlide(oldSlideIndex, newSliderIndex) {
      this.currentNomenclatureIndex = newSliderIndex

      if (newSliderIndex === this.nomenclatureList.length - 2) {
        this.getNomenclature('nextPage')
      }
    },
    onCLickNomenclature() {
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/styles/style';
.widget_wrapper {
  width: 100%;
}

</style>
