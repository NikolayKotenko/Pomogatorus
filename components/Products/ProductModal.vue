<template>
  <v-dialog
    v-model="$store.state.NomenclatureModule.stateProductModal"
    width="1136"
  >
    <v-card class="detail_card_product">
      <!-- Семейство Оборудования -->
      <div class="header">
        <div class="family_name">
          <span>Семейство:</span>
          <div class="card_name">
            {{ currentProduct._family.name }}
          </div>
        </div>
        <!--        <AddToFavoriteNomenclatures -->
        <!--          :favorite-object="favoriteData" -->
        <!--        /> -->
      </div>

      <!-- Фотографии Оборудования -->
      <!--      <div class="product_photos"> -->
      <!--        <ViewerStyled -->
      <!--          :images="currentProduct._family.photos" -->
      <!--          class="photos_container" -->
      <!--        > -->
      <!--          <img -->
      <!--            v-for="(image, index) in currentProduct._family.photos" -->
      <!--            :key="index" -->
      <!--            :src="image.url" -->
      <!--            alt="" -->
      <!--            class="photo" -->
      <!--          > -->
      <!--        </ViewerStyled> -->
      <!--        <div class="main_photo_wrapper"> -->
      <!--          <v-img -->
      <!--            :src="getMainProductPhoto" -->
      <!--            class="main_photo" -->
      <!--            contain -->
      <!--          /> -->
      <!--        </div> -->
      <!--      </div> -->

      <v-divider/>

      <!-- Модели Оборудования -->
      <div class="family_slider">
        <span>Модели:</span>
        <v-tabs
          show-arrows
          color="#000000"
          class="slider"
        >
          <v-tabs-slider color="#95D7AE"/>
          <v-tab
            v-for="(item, index) in listFamilyNomenclatures"
            :key="index"
          >
            {{ item.name }}
          </v-tab>
          <v-tab-item/>
        </v-tabs>
      </div>
      <!-- Инфорамация об Оборудовании -->
      <div class="product_detail_info">
        <v-tabs
          color="#95D7AE"
          vertical
          style="display: flex; flex-direction: row-reverse;"
        >
          <v-tab :key="0">
            Описание
          </v-tab>
          <v-tab :key="1">
            Характеристики
          </v-tab>
          <v-tab :key="2">
            Документация
          </v-tab>
          <v-tab-item :key="0">
            <div>
              <span class="product_description">
                {{ currentProduct._family.description }}
              </span>
            </div>
          </v-tab-item>
          <v-tab-item :key="1">
            <div class="product_characteristics">
              <div class="switch">
                <v-switch color="#95D7AE" hide-details/>
                <span>Только различающиеся характеристики</span>
              </div>
              <li>Артикул: {{ currentProduct.vendor_code }}</li>
              <li
                v-for="(character, index) in currentProduct._nomenclature_characteristics"
                :key="index"
              >
                {{ character.name }}: {{ character.value }}{{ character.postfix }}
              </li>
            </div>
          </v-tab-item>
          <v-tab-item :key="2">
            <div class="product_documents"/>
          </v-tab-item>
        </v-tabs>
      </div>
      <ButtonStyled
        :local-class="'style_close'"
        :local-text="'Закрыть'"
        @click-button="$store.dispatch('NomenclatureModule/closeProductModal')"
      />
    </v-card>
  </v-dialog>
</template>

<script>

import ButtonStyled from '../Common/ButtonStyled.vue'
import ViewerStyled from '../Common/ViewerStyled.vue'
import AddToFavoriteNomenclatures from '../Common/AddToFavoriteNomenclatures.vue'

export default {
  name: 'ProductModal',
  components: { AddToFavoriteNomenclatures, ViewerStyled, ButtonStyled },
  props: {
    currentProduct: {
      type: Object,
      require: true,
      default: () => ({}),
    },
  },
  data() {
    return {
      listFamilyNomenclatures: []
    }
  },
  methods: {
    getMainProductPhoto() {
      return this.currentProduct?._family?.photos[0]?.url;
    },
    getFilteredListNomenclaturesByFamily(objData) {
      this.listFamilyNomenclatures = this.$store.state.NomenclatureModule.listNomenclature
        .filter((elem) =>
          elem?._family?.id === objData?._family?.id
        )
    },
  },
}
</script>


<style scoped lang="scss">
@import '../../assets/styles/style';

.detail_card_product {
  display: inline-grid;
  grid-row-gap: 20px;
  width: 700px;
  // min-height: 700px !important;
  // max-height: 700px !important;
  overflow: auto;
  padding: 20px;
  .header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;

    .family_name{
      display: flex;
      align-items: center;

      .card_name {
        font-size: 1.5em;
        font-weight: 700;
        margin-left: 1em;
      }
    }

  }


  .product_photos {
    display: flex;
    max-height: 220px;
    width: 100%;

    .main_photo_wrapper {
      display: flex;
      justify-content: center;
      width: 100%;

      .main_photo {
        height: auto;
        max-width: 300px;
      }
    }

    .photo {
      display: grid;
      max-height: 70px;
      max-width: 70px;
      cursor: pointer;
      transition: $transition;
      margin-bottom: 10px;

      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }
    }

  }

  .family_slider{
    display: flex;
    align-items: center;
    .slider {

    }
  }

  .product_detail_info {
    height: 350px;


    .product_description {

    }

    .product_characteristics {
      color: #8A8784;
      margin-top: auto;
      .switch {
        display: flex;
        align-items: center;
        color: #000000;
        margin-bottom: 20px;
      }
    }
  }

}

.product_detail_buttons {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

}

.function_btn {
  width: 320px;
  max-width: 320px;
  margin-bottom: 0;
}
</style>
