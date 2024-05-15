<template>
  <div class="product_card_wrapper">
    <!-- Общая информация -->
    <div class="empty_placeholder">
      <v-img
        :src="getMainProductPhoto"
        style="filter: drop-shadow(0px 0px 40px #AAAAAA);"
      />
    </div>

    <div class="product_info">
      <div class="product_title">
        <div>
          <div class="brand_name">
            Baxi
          </div>
          <h3>{{ data.name }}</h3>
        </div>
        <AddToFavoriteNomenclatures
          :favorite-object="favoriteData"
        />
      </div>
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




      <!--        <li -->
      <!--          v-for="(character, index) in data._nomenclature_characteristics" -->
      <!--          :key="index" -->
      <!--        > -->
      <!--          {{ character.name }}: {{ character.value }}{{ character.postfix }} -->
      <!--        </li> -->
      <!--      </div> -->

      <!-- Меню Кнопок -->
      <div class="product_buttons">
        <div class="product_icons">
          <!-- Модальное окно. Детальная карточка товара -->
          <TooltipStyled
            :is-top="true"
            :title="'Подробнее о товаре'"
          >
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
          </TooltipStyled>
        </div>
      </div>
    </div>

    <!-- Избранное -->
  </div>
</template>

<script>
import SelectStyled from '../Common/SelectStyled.vue';
import TooltipStyled from '../Common/TooltipStyled.vue';
import ButtonStyled from '../Common/ButtonStyled.vue';
import ViewerStyled from '../Common/ViewerStyled.vue';
import IconTooltip from '../Common/IconTooltip.vue';
import AddToFavoriteNomenclatures from '../Common/AddToFavoriteNomenclatures.vue';
import { FavoriteNomenclature } from '~/helpers/constructors';

export default {
  name: 'ProductCard',
  components: { ViewerStyled, ButtonStyled, TooltipStyled, SelectStyled, IconTooltip, AddToFavoriteNomenclatures },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showModal: false,
      actionsWithProduct: [
        { action: 'Зарегистрировать покупку', value: 1 },
        { action: 'Оформить акт установки', value: 2 },
        { action: 'Оформить акт тех.обслуживания', value: 3 },
        { action: 'Оформить акт утилизации', value: 4 }
      ],
      listFamilyNomenclatures: []
    };
  },
  computed: {
    getMainProductPhoto() {
      return this.data?._family?.photos[0]?.url;
    },
    favoriteData(){
      return new FavoriteNomenclature(
          this.$store.getters['Objects/getIdCurrentObject'],
          this.$store.getters.getUserId,
          this.data?.id
        )
    },

  },
  watch: {
    '$store.state.Objects.currentObject.id':{
      async handler(idCurrentObject) {
        if (!idCurrentObject) return false;

        await this.$store.dispatch('NomenclatureModule/getListFavoriteNomenclatureByUserAndObjectId');
      }
    }
  },
  async mounted() {
    await this.$store.dispatch('NomenclatureModule/getListNomenclature');
  },
  methods: {
    changeFavoriteProduct() {
      this.$toast.success('Добавленно в избранное', { duration: 5000 });
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    getFilteredListNomenclaturesByFamily(objData) {
      this.listFamilyNomenclatures = this.$store.state.NomenclatureModule.listNomenclature
        .filter((elem) =>
          elem?._family?.id === objData?._family?.id
        )
    }
  }

};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/style';

.product_card_wrapper {
  display: inline-flex;
  grid-column-gap: 20px;
  justify-content: space-between;
  width: 850px;
  height: 270px;
  max-width: 850px;
  padding: 20px;
  background-color: #F2F2F2;
  border-radius: 30px;
  transition: $transition;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  }

  .product_info {
    display: grid;
    width: 100%;

    .product_title {
      display: flex;
      justify-content: space-between;
      .brand_name {
        font-size: 0.87em;
        color: #8A8784;
      }
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

  .product_buttons {
    display: grid;

    .product_icons {
      display: inline-flex;
      margin-bottom: auto;
      justify-content: flex-end;
    }
  }

  //.add_to_favorites_btn {
  //  position: absolute;
  //  top: 0;
  //  right: 0;
  //}

}

.empty_placeholder {
  background-color: #D9D9D9;
  background-size: contain;
  height: 100%;
  max-height: 230px;
  max-width: 212px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

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

<style lang="scss">

.v-input--selection-controls {
  margin: 0;
  padding: 0;
}
</style>
