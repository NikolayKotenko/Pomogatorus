<template>
  <div v-if="$store.getters.stateAuth" class="nomenclature_card_wrapper" draggable="false">
    <v-img
      v-if="getPhoto(nomenclatureData)"
      :src="getPhoto(nomenclatureData)"
      height="100"
      max-height="100"
      class="img"
      contain
      draggable="false"
    />
    <img v-else :src="require('/assets/svg/icons/no_img_icon.svg')" draggable="false" class="empty_img">
    <div
      draggable="false"
      class="nomenclature_info"
    >
      <div style="display: flex; justify-content: center">
        <hr class="hr">
      </div>
      <img draggable="false" :src="require('/assets/svg/icons/dottet_big_bg.svg')">
      <div draggable="false" class="price_and_name">
        <div draggable="false" class="price">
          9900P
        </div>
        <div draggable="false" class="name">
          {{ getNameNomenclature }}
        </div>
        <div
          v-for="(characteristic, index) in nomenclatureData._characteristics"
          :key="index"
          class="characteristics"
        >
          <div>
            {{ characteristic.value }}
          </div>
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
    getCharacteristicNameAndValue() {

    },
    favoriteData() {
      return new FavoriteNomenclature(
        this.$store.getters['Objects/getIdCurrentObject'],
        this.$store.getters.getUserId,
        this.nomenclatureData.data.id
      )
    },
    getNameNomenclature() {
      return this.nomenclatureData?._family?.name + ' ' + this.nomenclatureData?.name
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
  min-height: 180px;
  transition: all 0.5s ease;
  height: 180px;
  .img {
    height: 100px;
    width: 125px;
    z-index: 15;
    background: $white-color;
    border-radius: 8px 8px 0 0;
    border: 1px $grey1 solid;
    transform-origin: top;
  }
  .empty_img {
    height: 100px;
    width: 125px;
    z-index: 15;
    background-color: $white-color;
    border-radius: 8px 8px 0 0;
    border: 1px $grey1 solid;
    transform-origin: top;
  }
  .nomenclature_info {
    position: absolute;
    overflow: hidden;
    max-width: 125px;
    bottom: 0;
    z-index: 50;
    height: 80px;
    width: 100%;
    border-radius: 0 0 8px 8px;
    transition: all 0.5s ease;
    background-color: $grey3;
    transform-origin: bottom;

    img {
      position: absolute;
      z-index: 10;
      padding: 2px 5px 5px;
      transition: all 0.5s ease;
    }
    .hr {
      opacity: 0;
      color: $white-color;
      width: 45px;
      text-align: center;
      transition: all 0.5s ease-in;
      margin: 15px auto 0;
      z-index: 51;
      position: absolute;
      border: 1px solid;
    }
    .price_and_name {
      z-index: 20;
      width: 100%;
      height: 100%;
      border-radius: 0 0 8px 8px;
      padding: 10px;
      transition: all 0.5s ease;
      .price {
        @extend .text14;
        color: $white-text-color !important;
        font-weight: 500 !important;
        padding-bottom: 5px;
      }
      .name {
        @extend .text12;
        color: $white-text-color !important;
        font-weight: 500 !important;
        word-break: break-all;
        padding-bottom: 10px;
      }
      .characteristics {
        opacity: 0;
        transition: all 0.5s ease;
        display: flex;
        flex-direction: column;
        row-gap: 5px;
        @extend .text12;
        color: $grey1 !important;
        font-weight: 500 !important;
        word-break: break-all;
      }
    }
  }
  &:hover {
    .nomenclature_info {
      height: 180px;
      border-radius: $b-r8;
      .characteristics {
        opacity: 1;
      }
    }
    .hr {
      opacity: 1;
    }
    .price_and_name {
      padding: 25px 10px 10px;
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
