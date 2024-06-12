<template>
  <v-dialog
    v-model="$store.state.NomenclatureModule.idSelectedProduct"
    width="1136"
    :retain-focus="false"
  >
    <v-card class="detail_card_product">
      <!-- Семейство Оборудования -->
      <div class="header_card">
        <div class="family_name">
          <span>Семейство: </span>
          <div>
            {{ currentProduct._family.name }}
          </div>
        </div>
        <div class="details_btn">
          Подробнее о семействе
        </div>
        <v-icon
          large
          color="#000000"
          class="close_btn"
          @click="$store.state.NomenclatureModule.idSelectedProduct = false"
        >
          mdi-close
        </v-icon>
        <!--        <AddToFavoriteNomenclatures -->
        <!--          :favorite-object="favoriteData" -->
        <!--        /> -->
      </div>

      <!-- Фотографии Оборудования -->


      <v-divider style="border-color: #DDDDDD;"/>

      <div class="model_container">
        <!-- Фото моделей -->
        <div class="model_photo_container">
          <div class="model_name">
            Модель: {{ currentProduct.name }}
          </div>
          <div class="product_photos">
            <ViewerStyled
              :images="currentProduct._family.photos"
              class="photos_container"
            >
              <div
                v-for="(image, index) in currentProduct._family.photos"
                :key="index"
                class="small_empty_placeholder"
              >
                <img
                  :src="image.url"
                  style="filter: drop-shadow(0px 0px 40px #f1f1f1);"
                  alt=""
                  class="photo"
                >
              </div>
            </ViewerStyled>
            <div class="empty_placeholder">
              <v-img
                :src="getMainProductPhoto"
                style="filter: drop-shadow(0px 0px 40px #f1f1f1);"
                max-width="415"
                max-height="315"
                contain
              />
            </div>
          </div>
        </div>

        <!-- Инфорамация об Оборудовании -->
        <div class="model_detail_info">
          <v-tabs color="#FF6347" hide-slider>
            <v-tab :key="0">
              Описание семейства
            </v-tab>
            <v-tab :key="1">
              Характеристики
            </v-tab>
            <v-tab :key="2">
              Документация
            </v-tab>
            <v-tab-item :key="0">
              {{ currentProduct._family.description }}
            </v-tab-item>
            <v-tab-item :key="1">
              <div class="product_info_list">
                <div>Монтаж: </div>
                <div class="dot_border"/>
                <div>Настенный</div>
              </div>
              <div class="product_info_list">
                <div>Срок эксплуатации: </div>
                <div class="dot_border"/>
                <div>20 лет</div>
              </div>
              <div class="product_info_list">
                <div>Камера сгорания: </div>
                <div class="dot_border"/>
                <div>Закрытая с принудительным удалением продуктов сгорания</div>
              </div>
              <div class="product_info_list">
                <div>Мощность: </div>
                <div class="dot_border"/>
                <div>20 кВт</div>
              </div>
              <div class="product_info_list">
                <div>Назначение котла: </div>
                <div class="dot_border"/>
                <div>Отопление и ГВС</div>
              </div>
            </v-tab-item>
            <v-tab-item :key="2"/>
          </v-tabs>
        </div>
      </div>
      <div class="button_container">
        <div class="add_to_compare_list">
          <img :src="require(`~/assets/svg/icons/icon_compare.svg`)" alt="Сравнить">
          Сравнить
        </div>
        <ButtonStyled
          v-if="! stateCurrentNomenclature"
          :local-text=" 'Добавить в объект'"
          class="add_to_object_style"
          @click-button="addToObject"
        />
        <ButtonStyled
          v-if="stateCurrentNomenclature"
          :local-text="'Уже в объекте'"
          class="active_add_btn"
          @click-button="deleteFromObject"
        />
        <div class="add_to_favorites_btn">
          <img :src="require(`~/assets/svg/icons/heart_outline.svg`)" alt="Добавить в избранное">
        </div>
      </div>
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
    },
  },
  data() {
    return {
      listFamilyNomenclatures: []
    }
  },
  computed: {
    getMainProductPhoto() {
      return this.currentProduct?._family?.photos[0]?.url;
    },
    stateCurrentNomenclature() {
      return this.$store.state.NomenclatureModule.listFavoriteNomenclature.some((elem) => elem.id_nomenclature === this.currentProduct.id)
    },
  },
  methods: {
    async addToObject() {
      await this.$store.dispatch('NomenclatureModule/setFavoritesNomenclatureByObject', this.currentProduct.id)

      this.$toast.success('Оборудование добавленно на объект')
    },
    async deleteFromObject() {
      await this.$store.dispatch('NomenclatureModule/deleteOneFavoriteNomenclature', this.currentProduct.id)

      this.$toast.success('Оборудование удаленно из объекта')
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
  font-family: 'Inter', sans-serif;
  display: inline-grid;
  width: 100%;
  // min-height: 700px !important;
  // max-height: 700px !important;
  overflow: auto;
  border-radius: 30px;
  .header_card {
    display: flex;
    align-items: center;
    padding: 20px 40px;

    .family_name{
      display: flex;
      align-items: center;
      font-size: 1.5em;
      font-weight: 700;
    }
    .details_btn {
      text-decoration: underline;
      color: #777777;
      cursor: pointer;
      margin-left: 20px;
    }
    .close_btn {
      margin-left: auto;
    }

  }
  .model_container {
    display: flex;
    padding: 20px 40px;
    grid-column-gap: 40px;
    min-height: 400px;
    .model_photo_container {
      display: grid;
      margin-bottom: auto;
      .model_name {
        font-weight: 600;
        margin-bottom: 20px;
      }
      .product_photos {
        display: flex;
        max-height: 315px;
        width: 100%;
        height: 100%;
        .photos_container {
          margin-right: 20px;
          .small_empty_placeholder {
            background-color: #AAAAAA;
            background-size: contain;
            height: 80px;
            max-width: 80px;
            border-radius: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 10px;
          }
          .photo {
            display: grid;
            max-height: 80px;
            max-width: 80px;
            cursor: pointer;
            transition: $transition;


            &:hover {
              background: rgba(0, 0, 0, 0.05);
            }
          }
        }
        .empty_placeholder {
          background-color: #AAAAAA;
          background-size: contain;
          height: 315px;
          max-width: 415px;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          .main_photo {
            height: auto;
            max-width: 415px;
          }
        }
        }
      }
    }
    .button_container {
      padding: 0 40px 40px 40px;
      display: flex;
      justify-content: flex-end;
      grid-column-gap: 10px;
      align-items: center;
      .add_to_compare_list {
        height: 40px;
        border-radius: 15px;
        background-color: #D9D9D9;
        display: flex;
        grid-column-gap: 10px;
        align-items: center;
        padding: 0 20px;
        font-size: 0.875em;
        font-weight: 600;
        cursor: pointer;
      }
      .add_to_favorites_btn {
        border-radius: 15px;
        background-color: #D9D9D9;
        align-items: center;
        height: 40px;
        width: 40px;
        display: flex;
        justify-content: center;
      }
    }
    .model_detail_info {
      .v-tab {
        color: #777777;
        font-weight: 600;
        max-height: 25px;
        margin: 0 20px 0 0!important;
        padding: 0 !important;
        border-bottom: 3px solid #FFFFff;
      }
      .v-tab:before {
        color: #000000;
      }
      .v-tab--active {
        color: #000000;
        border-bottom: 3px solid #FF6347;
      }
      .product_info_list {
        display: flex;
        width: 100%;
        font-size: 0.8em;
        color: #8A8784;
        margin-top: auto;
        text-wrap: nowrap;
        .dot_border {
          border-bottom: 1px dotted #111111;
          width: 100%;
          margin-bottom: 5px;
        }
      }
    }
  }
  .add_to_object_style {
    border-radius: 15px;
    background-color: #DDDDDD !important;
    box-shadow: none;
    font-weight: 600;
    border: none;
    &:hover {
      box-shadow: $shadowBox;
    }
  }
  .active_add_btn {
    border-radius: 15px;
    background-color: #FF6347 !important;
    color: #FFFFFF;
    box-shadow: none;
    font-weight: 600;
    border: none;
    &:hover {
      box-shadow: $shadowBox;
    }
  }


.v-tabs-slider-wrapper {
  height: 3px !important;
  padding: 0 16px !important;
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
