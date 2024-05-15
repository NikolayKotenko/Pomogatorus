<template>
  <v-dialog
    v-model="showModal"
    width="700"
  >
    <template #activator="{ on, attrs }">
      <v-icon
        size="36"
        v-bind="attrs"
        color="#000000"
        v-on="on"
        @click="getFilteredListNomenclaturesByFamily(data)"
      >
        mdi-list-box-outline
      </v-icon>
    </template>

    <v-card class="detail_card_product">
      <!-- Семейство Оборудования -->
      <div class="header">
        <div class="family_name">
          <span>Семейство:</span>
          <div class="card_name">
            {{ data._family.name }}
          </div>
        </div>
        <AddToFavoriteNomenclatures
          :favorite-object="favoriteData"
        />
      </div>


      <!-- Фотографии Оборудования -->
      <div class="product_photos">
        <ViewerStyled
          :images="data._family.photos"
          class="photos_container"
        >
          <img
            v-for="(image, index) in data._family.photos"
            :key="index"
            :src="image.url"
            alt=""
            class="photo"
          >
        </ViewerStyled>
        <div class="main_photo_wrapper">
          <v-img
            :src="getMainProductPhoto"
            class="main_photo"
            contain
          />
        </div>
      </div>

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
                {{ data._family.description }}
              </span>
            </div>
          </v-tab-item>
          <v-tab-item :key="1">
            <div class="product_characteristics">
              <div class="switch">
                <v-switch color="#95D7AE" hide-details/>
                <span>Только различающиеся характеристики</span>
              </div>
              <li>Артикул: {{ data.vendor_code }}</li>
              <li
                v-for="(character, index) in data._nomenclature_characteristics"
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
        @click-button="closeModal"
      />
    </v-card>
  </v-dialog>
</template>

<script>

import ButtonStyled from '../Common/ButtonStyled.vue'
import ViewerStyled from '../Common/ViewerStyled.vue'
import AddToFavoriteNomenclatures from '../Common/AddToFavoriteNomenclatures.vue'

export default {
  components: { AddToFavoriteNomenclatures, ViewerStyled, ButtonStyled }
}
</script>


<style scoped lang="scss">

</style>
