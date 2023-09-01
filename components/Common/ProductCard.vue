<template>
  <v-container class="product_card_wrapper">
    <!-- Общая информация -->
    <v-img
      class="empty_placeholder"
      src="https://baxi.ru/upload/iblock/0d1/ECO_Nova_001.png"
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
        <TooltipStyled
          :title="'Добавить в избранное'"
          :is-top="true"
        >
          <v-icon
            size="36"
            @click="changeFavoriteProduct"
          >
            mdi-heart-outline
          </v-icon>
        </TooltipStyled>

        <!-- Модальное окно. Детальная карточка товара -->
        <TooltipStyled
          :title="'Подробнее о товаре'"
          :is-top="true"
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
              >
                mdi-list-box-outline
              </v-icon>
            </template>

            <v-card class="detail_card_product">
              <h2>{{ data.name }}</h2>

              <!-- Фотографии Оборудования -->
              <div class="product_photos">
                <v-img
                  contain
                  class="main_photo"
                  src="https://baxi.ru/upload/resize_cache/iblock/9f7/nhgq6mqyk0hiqa1nj4z5xumqvil0ursp/800_700_1/ECO_LIFE_124F_03.png"
                />
              </div>
              <v-divider/>

              <!-- Инфорамация об Оборудовании -->
              <div class="product_detail_info">
                <v-tabs vertical color="#95D7AE">
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
                      <span class="product_description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                        ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat.
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
                  class="function_btn"
                  :items="actionsWithProduct"
                  :item-text="'action'"
                  :item-value="'value'"
                  :is-solo="true"
                  :placeholder="'Выберите действие'"
                />
                <div>
                  <ButtonStyled
                    :local-text="'Закрыть'"
                    :local-class="'style_close'"
                    @click-button="closeModal"
                  />
                </div>
              </div>
            </v-card>
          </v-dialog>
        </TooltipStyled>

        <!-- Ссылка на маркетплейс -->
        <TooltipStyled
          :title="'Перейти в Яндекс Маркет'"
          :is-top="true"
        >
          <v-icon size="36">
            mdi-store-outline
          </v-icon>
        </TooltipStyled>

        <!-- Модальное окно эксплуатации -->
        <TooltipStyled
          :title="'Подробнее об эксплуатации'"
          :is-top="true"
        >
          <v-icon size="36">
            mdi-file-cog-outline
          </v-icon>
        </TooltipStyled>
      </div>
      <div class="product_detail_buttons">
        <SelectStyled
          class="function_btn"
          :items="actionsWithProduct"
          :item-text="'action'"
          :item-value="'value'"
          :is-solo="true"
          :placeholder="'Выберите действие'"
        />
      </div>
    </div>
  </v-container>
</template>

<script>
import SelectStyled from './SelectStyled.vue';
import TooltipStyled from './TooltipStyled.vue';
import ButtonStyled from './ButtonStyled.vue';

export default {
  name: 'ProductCard',
  components: { ButtonStyled, TooltipStyled, SelectStyled },
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
        { action: 'Оформить акт утилизации', value: 4 },
      ],
    }
  },
  async mounted() {
    await this.$store.dispatch('NomenclatureModule/getListNomenclature')
  },
  methods: {
    changeFavoriteProduct(){
      this.$toast.success('Добавленно в избранное', { duration: 5000 })
    },
    openModal() {
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    },
  },

}
</script>

<style lang="scss" scoped>
.product_card_wrapper{
  display: inline-flex;
  grid-column-gap: 20px;
  justify-content: space-between;
  width: 100%;
  height: 180px;
  padding: 20px;
  margin-top: 20px;
  border-radius: 5px;
  transition: all 0.4s ease-in-out;
  &:hover {
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    background-color: #FFF4CB;
  }

  .product_info{
    display: grid;
    margin-right: auto;

    .product_info_list{
      font-size: 0.8em;
      color: #8A8784;
      margin-top: auto;
    }
  }
  .product_buttons{
    display: grid;

    .product_icons {
      display: inline-flex;
      margin-bottom: auto;
      justify-content: end;
    }
  }
}
.empty_placeholder{
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
.detail_card_product{
  display: inline-grid;
  width: 675px;
  height: 700px;
  padding: 20px;
  .product_photos {
    display: flex;
    justify-content: center;
    height: 220px;
    .main_photo{
      background-size: contain;
      max-width: 350px;
    }
  }
  .product_detail_info{
    height: 200px;
    .product_description{
      font-size: 0.9em;
    }
    .product_characteristics{
      font-size: 0.9em;
      color: #8A8784;
      margin-top: auto;
    }
  }

}
.product_detail_buttons{
  display: flex;
  justify-content: space-between;
  align-items: end;

}
.function_btn{
  width: 320px;
  max-width: 320px;
  margin-bottom: 0;
}
</style>
