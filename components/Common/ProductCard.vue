<template>
  <v-container class="product_card_wrapper">
    <!-- Общая информация -->
    <v-img
      class="empty_placeholder"
      :src="getMainProductPhoto"
    />
    <div class="product_info">
      <div class="product_title">
        <h3>{{ data.name }}</h3>
      </div>
      <div class="product_info_list">
        <li>Артикул: {{ data.vendor_code }}</li>
        <li
          v-for="(character, index) in data._nomenclature_characteristics"
          :key="index"
        >
          {{ character.name }}: {{ character.value }}{{ character.postfix }}
        </li>
      </div>
    </div>

    <!-- Меню Кнопок -->
    <div class="product_buttons">
      <div class="product_icons">
        <!-- Избранное -->
        <IconTooltip
          :color-icon="'#000000'"
          :size-icon="36"
          :icon-text="'mdi-heart-outline'"
          :text-tooltip="'Добавить в избранное'"
        />

        <!-- Модальное окно. Детальная карточка товара -->
        <TooltipStyled
          :is-top="true"
          :title="'Подробнее о товаре'"
        >
          <v-dialog
            v-model="showModal"
            width="675"
          >
            <template #activator="{ on, attrs }">
              <v-icon
                size="36"
                v-bind="attrs"
                v-on="on"
                color="#000000"
              >
                mdi-list-box-outline
              </v-icon>
            </template>

            <v-card class="detail_card_product">
              <div class="card_name">
                {{ data.name }}
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
                    class="main_photo"
                    contain
                    :src="getMainProductPhoto"
                  />
                </div>
              </div>
              <v-divider/>

              <!-- Инфорамация об Оборудовании -->
              <div class="product_detail_info">
                <v-tabs color="#95D7AE" vertical>
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

              <!-- Функциональные кнопки -->
              <div class="product_detail_buttons">
                <SelectStyled
                  :is-solo="true"
                  :item-text="'action'"
                  :item-value="'value'"
                  :items="actionsWithProduct"
                  :placeholder="'Выберите действие'"
                  class="function_btn"
                />
                <div>
                  <ButtonStyled
                    :local-class="'style_close'"
                    :local-text="'Закрыть'"
                    @click-button="closeModal"
                  />
                </div>
              </div>
            </v-card>
          </v-dialog>
        </TooltipStyled>

        <!-- Ссылка на маркетплейс -->
        <IconTooltip
          :color-icon="'#000000'"
          :size-icon="36"
          :icon-text="'mdi-store-outline'"
          :text-tooltip="'Перейти в Яндекс Маркет'"
        />
        <!-- Модальное окно эксплуатации -->
        <IconTooltip
          :color-icon="'#000000'"
          :size-icon="36"
          :icon-text="'mdi-file-cog-outline'"
          :text-tooltip="'Подробнее об эксплуатации'"
        />
      </div>
      <div class="product_detail_buttons">
        <SelectStyled
          :is-solo="true"
          :item-text="'action'"
          :item-value="'value'"
          :items="actionsWithProduct"
          :placeholder="'Выберите действие'"
          class="function_btn"
        />
      </div>
    </div>
  </v-container>
</template>

<script>
import SelectStyled from './SelectStyled.vue';
import TooltipStyled from './TooltipStyled.vue';
import ButtonStyled from './ButtonStyled.vue';
import ViewerStyled from './ViewerStyled.vue';
import IconTooltip from './IconTooltip.vue';

export default {
  name: 'ProductCard',
  components: { ViewerStyled, ButtonStyled, TooltipStyled, SelectStyled, IconTooltip },
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
      ]
    };
  },
  computed: {
    getMainProductPhoto() {
      return this.data?._family?.photos[0].url
    },
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
    }
  }

};
</script>

<style lang="scss" scoped>
@import 'assets/styles/style';

.product_card_wrapper {
  display: inline-flex;
  grid-column-gap: 20px;
  justify-content: space-between;
  width: 100%;
  height: 180px;
  padding: 20px;
  margin-top: 20px;
  background-color: #FFFFFF;
  border-radius: 5px;
  transition: $transition;

  &:hover {
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    background-color: #FFF4CB;
  }

  .product_info {
    display: grid;
    margin-right: auto;

    .product_info_list {
      font-size: 0.8em;
      color: #8A8784;
      margin-top: auto;
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
}

.empty_placeholder {
  background-color: #FFFFFF;
  background-size: contain;
  height: 100%;
  max-height: 140px;
  max-width: 140px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.detail_card_product {
  display: inline-grid;
  grid-row-gap: 20px;
  width: 700px;
  height: 700px;
  padding: 20px;
  .card_name {
    font-size: 1.5em;
    font-weight: 700;
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

  .product_detail_info {
    height: 200px;

    .product_description {
      font-size: 0.9em;
    }

    .product_characteristics {
      font-size: 0.9em;
      color: #8A8784;
      margin-top: auto;
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
