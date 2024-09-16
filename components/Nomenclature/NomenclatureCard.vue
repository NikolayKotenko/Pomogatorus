<template>
  <div class="nomenclature_card_wrapper">
    <v-img
      v-if="getPhoto(nomenclatureData.data)"
      :src="getPhoto(nomenclatureData.data)"
      class="img"
      height="100"
      contain
    />
    <div v-else class="empty_img"/>
    <div class="nomenclature_info">
      <img :src="require('/assets/svg/icons/grey_dottet_bg.svg')">
      <div class="price_and_name">
        <div class="price">
          9900P
        </div>
        <div class="name">
          {{ nomenclatureData.data._family.name + '' + nomenclatureData.data.name }}
        </div>
      </div>
    </div>
  </div>
<!--  <div -->
<!--    :class="{'c-nomenclature-info': !noInfo}" -->
<!--    class="c-nomenclature" -->
<!--    draggable="false" -->
<!--  > -->
<!--    <div class="c-nomenclature__img"> -->
<!--      &lt;!&ndash;      <div class="c-nomenclature__img__like" draggable="false"> &ndash;&gt; -->
<!--      &lt;!&ndash;        <AddToFavoritesNomenclatures &ndash;&gt; -->
<!--      &lt;!&ndash;          :favorite-object="favoriteData" &ndash;&gt; -->
<!--      &lt;!&ndash;          draggable="false" &ndash;&gt; -->
<!--      &lt;!&ndash;        /> &ndash;&gt; -->
<!--      &lt;!&ndash;      </div> &ndash;&gt; -->

<!--      <template v-if="getPhoto(nomenclatureData.data)"> -->
<!--        <img :alt="nomenclatureData.data.name" :src="getPhoto(nomenclatureData.data)" draggable="false"> -->
<!--      </template> -->

<!--      &lt;!&ndash;     NO PHOTO     &ndash;&gt; -->
<!--      <template v-else> -->
<!--        <img :alt="nomenclatureData.data.name" draggable="false" src="https://baxi.ru/photo/ECO_Nova_004.png"> -->
<!--      </template> -->
<!--      &lt;!&ndash;     TODO: Убрать моковую картинку         &ndash;&gt; -->
<!--      &lt;!&ndash;              <template> &ndash;&gt; -->
<!--      &lt;!&ndash;                <img :alt="slide.data.name" :src="require('~/assets/images/noImage.webp')"> &ndash;&gt; -->
<!--      &lt;!&ndash;              </template> &ndash;&gt; -->
<!--    </div> -->

<!--    &lt;!&ndash;     INFO     &ndash;&gt; -->
<!--    <div class="c-nomenclature__info"> -->
<!--      <img :src="require('/assets/svg/icons/grey_dottet_bg.svg')"> -->
<!--      <div class="price_and_name"> -->
<!--        <div class="price"> -->
<!--          9990 P -->
<!--        </div> -->
<!--        <div class="name"> -->
<!--          {{ nomenclatureData.data._family.name + '' + nomenclatureData.data.name }} -->
<!--        </div> -->
<!--      </div> -->
<!--    </div> -->
<!--  </div> -->
</template>

<script>
import AddToFavoritesNomenclatures from '../Common/AddToFavoriteNomenclatures'
import { FavoriteNomenclature } from '~/helpers/constructors'

export default {
  name: 'NomenclatureCard',
  components: { AddToFavoritesNomenclatures },
  props: {
    nomenclatureData: {
      type: Object,
      required: true
    },
    noInfo: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    favoriteData() {
      return new FavoriteNomenclature(
        this.$store.getters['Objects/getIdCurrentObject'],
        this.$store.getters.getUserId,
        this.nomenclatureData.data.id
      )
    }
  },
  methods: {
    getPhoto(slide) {
      const url = (slide?._family?.photos && slide?._family?.photos[0]) ?? null

      if (url) {
        return this.$store.state.BASE_URL + url?.full_path
      } else {
        return null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/styles/style';

.nomenclature_card_wrapper {
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
  align-items: center;
  max-width: 125px;
  max-height: 180px;
  min-width: 125px;
  height: 180px;
  .img {
    height: 100px;
    width: 125px;
    position: relative;
    background: $white-color;
    border-radius: 8px 8px 0 0;
  }
  .empty_img {
    background-color: $white-color;
    width: 125px;
    height: 100px;
    background-image: url("assets/svg/icons/no_img_icon.svg");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 50%;
    border-radius: 8px 8px 0 0;
    display: flex;
  }
  .nomenclature_info {
    position: relative;
    z-index: 10;
    height: 100%;
    max-height: 80px;
    width: 100%;
    border-radius: 0 0 8px 8px;
    background-color: $grey3;
    img {
      position: absolute;
      z-index: 12;
      padding: 2px 5px 5px;
    }
    .price_and_name {
      z-index: 13;
      width: 100%;
      height: 100%;
      border-radius: 0 0 8px 8px;
      .price {
        @extend .text14;
        color: $white-text-color !important;
        font-weight: 500 !important;
      }
      .name {
        @extend .text12;
        color: $white-text-color !important;
        font-weight: 500 !important;
        word-break: break-all;
      }
    }
  }
}



.c-nomenclature {
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 180px;
  width: 125px;


  &__img {
    height: 100px;
    width: 125px;
    position: relative;
    background: #FFFFFF;
    border-radius: 8px 8px 0 0;

    &__like {
      position: absolute;
      right: 0;
      padding: 10px;
    }

    img {
      height: 100px;
      width: 125px;
      margin: 0 auto;
      object-fit: contain;
    }
  }

  &__info {
    background-color: $grey3;
    width: 100%;
    height: 100%;
    border-radius: 0 0 8px 8px;
    position: relative;
    z-index: 9;
    img {
      position: absolute;
      z-index: 12;
      padding: 2px 5px 5px;
    }
    .price_and_name {
      z-index: 11;
      padding: 5px 10px 10px;
      .price {
        @extend .text14;
        color: $white-text-color !important;
        font-weight: 500 !important;
      }
      .name {
        @extend .text12;
        color: $white-text-color !important;
        font-weight: 500 !important;
        word-break: break-all;
      }

    }
  }
}

.c-nomenclature-info {
  padding: 20px;
  background: #E3E3E3;
  border-radius: 5px;
  cursor: pointer;
  width: 290px;
  min-height: 370px;

  &:hover {
    @extend .background-hover;
  }
}

@media only screen and (max-width: 1200px) {
  .c-nomenclature__img {
    width: 200px;
  }

  .c-nomenclature__img img {
    width: 200px;
  }

  .c-nomenclature-info {
    width: 250px;
  }
}

@media only screen and (max-width: 768px) {
  .c-nomenclature-info {
    width: 100%;
  }
}
</style>
