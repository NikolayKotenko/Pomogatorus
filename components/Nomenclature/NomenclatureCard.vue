<template>
  <div
    :class="{'c-nomenclature-info': !noInfo}"
    class="c-nomenclature"
    draggable="false"
  >
    <div class="c-nomenclature__img">
      <div class="c-nomenclature__img__like" draggable="false">
        <AddToFavoritesNomenclatures
          :favorite-object="favoriteData"
          draggable="false"
        />
      </div>

      <template v-if="getPhoto(nomenclatureData.data)">
        <img :alt="nomenclatureData.data.name" :src="getPhoto(nomenclatureData.data)" draggable="false">
      </template>

      <!--     NO PHOTO     -->
      <template v-else>
        <img :alt="nomenclatureData.data.name" draggable="false" src="https://baxi.ru/photo/ECO_Nova_004.png">
      </template>
      <!--     TODO: Убрать моковую картинку         -->
      <!--              <template> -->
      <!--                <img :alt="slide.data.name" :src="require('~/assets/images/noImage.webp')"> -->
      <!--              </template> -->
    </div>

    <!--     INFO     -->
    <div v-if="!noInfo" class="c-nomenclature__info">
      <h4 class="c-nomenclature__info__label">
        {{ nomenclatureData.data.name }}
      </h4>
    </div>
  </div>
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
