<template>
    <IconTooltip
        :size-icon="'32'"
        :color-icon="! stateCurrentNomenclature ? '#B3B3B3' : '#95D7AE'"
        :icon-text="! stateCurrentNomenclature ? 'mdi-heart-outline' : 'mdi-heart'"
        :text-tooltip="! stateCurrentNomenclature ? 'Добавить в избранное' : 'Уже в избранном'"
        @click-icon="addToFavoritesNomenclature"
    />
</template> 

<script>
import IconTooltip from './IconTooltip.vue';

export default {
    name: 'AddToFavoritesNomenclatures',
    components: { IconTooltip, },
    props: {
        favoriteObject: {
            type: Object,
            required: true,
            default: () => ({})
        },
    },
    data() {
        return {
            
        }
    },
    computed: {
        stateCurrentNomenclature() {
            return this.$store.state.NomenclatureModule.listFavoriteNomenclature.some((elem) => {
                    return elem.id === this.favoriteObject.id_nomenclature
            })
        }
            // return this.favoriteObject.id === this.$store.state.Objects.currentObject?.id;
    },
    methods: {
    async addToFavoritesNomenclature() {
      if (this.stateCurrentNomenclature === true) {
        this.$toast.error('Уже в избранном');
        return false;
      }

      await this.$store.dispatch(
        'NomenclatureModule/setFavoritesNomenclatureByObject',
        this.favoriteObject
      );

      this.$toast.success('Добавленно в избранное оборудование',{ duration: 5000 })
    },
    },
}
</script>
