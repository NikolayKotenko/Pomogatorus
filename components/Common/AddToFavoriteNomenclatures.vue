<template>
    <IconTooltip
        :size-icon="'32'"
        :color-icon="'#B3B3B3'"
        :icon-text="'mdi-heart-outline'"
        :text-tooltip="'Добавить в избранное'"
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
    methods: {
    async addToFavoritesNomenclature() {
      await this.$store.dispatch(
        'NomenclatureModule/setFavoritesNomenclatureByObject',
        this.favoriteObject
      );
    },
    },
}
</script>
