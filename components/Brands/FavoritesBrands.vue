<template>
  <v-container class="brands_wrapper">
    <div class="top_wrapper">
      <span class="title">
        Избранные бренды
      </span>
      <UniversalAddInput
        :list-items-available-to-add="$store.state.BrandsModule.listBrands"
        @add-service="addBrandInFavorites"
      />
    </div>
    <div class="list_brands">
      <template v-if="$store.state.BrandsModule.listFavoritesBrands.length">
        <v-card
          v-for="(brand, index) in $store.state.BrandsModule.listFavoritesBrands"
          :key="index"
          class="brand_wrapper"
          height="60"
        >
          <div style="display: flex;">
            <span class="brand_name">{{ brand._brands.name }}</span>
            <DropDownMenuStyled
              :is-left="true"
              :is-offset-y="true"
            >
              <template #icon>
                <v-img
                  :src="getBrandPhoto(brand._brands)"
                  width="60"
                  height="24"
                />
              </template>
              <template #content>
                <BrandCard
                  :brand-object="brand._brands"
                />
              </template>
            </DropDownMenuStyled>
          </div>
          <IconTooltip
            :color-icon="'#B3B3B3'"
            :icon-text="'mdi-delete-outline'"
            :size-icon="'24'"
            :text-tooltip="'Удалить бренд'"
            @click-icon="deleteBrandByFavorites(brand._brands)"
          />
        </v-card>
      </template>
      <template v-else>
        <span class="title">У вас нет избранных брендов</span>
      </template>
    </div>
  </v-container>
</template>

<script>
import UniversalAddInput from '../Common/UniversalAddInput.vue'
import BrandCard from '../Common/BrandCard.vue'
import IconTooltip from '../Common/IconTooltip.vue'
import DropDownMenuStyled from '../Common/DropDownMenuStyled.vue'

export default {
  name: 'FavoritesBrands',
  components: {
    DropDownMenuStyled, IconTooltip,
    BrandCard,
    UniversalAddInput
  },
  data() {
    return {

    }
  },
  async mounted() {
    await this.$store.dispatch('BrandsModule/getListFavoritesBrands')
    await this.$store.dispatch('BrandsModule/getListBrands')
  },
  methods: {
    async addBrandInFavorites(obj) {
      if (this.$store.state.BrandsModule.listFavoritesBrands.find(item => item.id_brand === obj.id)) {
        this.$toast.error('Такой бренд уже в избранном');
        return false;
      }

      await this.$store.dispatch('BrandsModule/addBrandsToFavoritesBrands', obj.id)

      const message = 'Добавлен бренд ' + obj.name + ' в избранное'
      this.$toast.success(message);
    },
    async deleteBrandByFavorites(brandData) {
      await this.$store.dispatch('BrandsModule/deleteBrandsByFavoritesBrands', brandData.id)

      const message = 'Удалён из избранного бренд ' + brandData.name
      this.$toast.success(message);
    },
    getBrandPhoto(elem) {
      if (elem.e_client_files.length) {
        return elem.e_client_files[0].url
      }
    },
  }
}
</script>


<style scoped lang="scss">
@import 'assets/styles/style';

.brands_wrapper {
  padding: 20px;
  background-color: white;
  overflow: auto;
  width: 740px;
  max-height: 840px;
  min-height: 500px;
  box-shadow: $shadowBox;
  border-radius: 30px;
  margin: 4px 4px 10px 4px;
  .top_wrapper {
    display: grid;
    grid-row-gap: 1em;
    width: 100%;
    grid-column-gap: 1em;
    margin-bottom: 2em;
    background-color: #FFFFFF;
    .title {
      font-size: 1.5em;
      font-weight: 700;
    }
  }
  .list_brands {
    display: grid;
    grid-row-gap: 20px;
    .brand_wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 1em;

      .brand_img {

      }
      .brand_name {
        font-size: 2.2em;
        display: flex;
        align-items: center;
        margin-right: 10px;
      }
    }
  }
}
</style>
