<template>
  <img
    :src="require(`~/assets/svg/icons/add_to_favorites_icon.svg`)"
    alt="Добавить в избранное"
    class="icon_style"
  >
<!--  <img -->
<!--    :src="require(`~/assets/svg/icons/delete_on_favorites_icon.svg`)" -->
<!--    alt="Убрать из избранного" -->
<!--    class="icon_style" -->
<!--  > -->
<!--  <IconTooltip -->
<!--    :size-icon="'28'" -->
<!--    :color-icon="! stateCurrentNomenclature ? '#B3B3B3' : '#95D7AE'" -->
<!--    :icon-text="! stateCurrentNomenclature ? 'mdi-heart-outline' : 'mdi-heart'" -->
<!--    :text-tooltip="! stateCurrentNomenclature ? 'Добавить в избранное' : 'Убрать из избранного'" -->
<!--    @click-icon="addOrDeleteFavorites" -->
<!--  /> -->
</template>

<script>
import PdfContent from '../PdfReports/PdfContent.vue'
import IconTooltip from './IconTooltip.vue';

export default {
  name: 'AddToFavoritesNomenclatures',
  components: { PdfContent, IconTooltip, },
  props: {
    favoriteObject: {
      type: Object,
      required: true,
      default: () => ({})
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {
    stateCurrentNomenclature() {
      return this.$store.state.NomenclatureModule.listFavoriteNomenclature.some((elem) => {
        return elem.id === this.favoriteObject.id_nomenclature
      })
    },

  },
  methods: {
    async addToFavoritesNomenclature() {
      await this.$store.dispatch(
        'NomenclatureModule/setFavoritesNomenclatureByObject',
        this.favoriteObject
      );

     this.$toast.success('Добавленно в избранное оборудование',{ duration: 5000 })
    },

    async deleteFavoriteNomenclature(){
      await this.$store.dispatch(
        'NomenclatureModule/deleteOneFavoriteNomenclature',
        this.favoriteObject
      );

      this.$toast.success('Убранно из избранного',{ duration: 5000 })
    },
    addOrDeleteFavorites() {
      ! this.stateCurrentNomenclature ? this.addToFavoritesNomenclature() : this.deleteFavoriteNomenclature()
    }
  },
}
</script>

<style lang="scss" scoped>
.icon_style {
  height: 30px;
}

</style>
