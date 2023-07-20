<template>
  <v-container class="product_card_wrapper">
    <!--    <v-img -->
    <!--      v-if="$store.getters.getImageByEClientFilesObj(item.e_client_files)" -->
    <!--      :class="{'empty_placeholder': ! $store.getters.getImageByEClientFilesObj(item.e_client_files) }" -->
    <!--      :src="$store.getters.getImageByEClientFilesObj(item.e_client_files)" -->
    <!--    /> -->
    <div class="empty_placeholder">
      <span>Фото оборудования</span>
    </div>
    <div class="product_info">
      <div class="product_title">
        <h3>Электрический котел Baxi 20кВт</h3>
      </div>
      <div class="product_info_list">
        <li>Артикуль: 13146565</li>
        <li>Монтаж: Настенный</li>
        <li>Срок эксплуатации: 12 лет</li>
        <li>Тип топлива: газ</li>
        <li>Назначение котла: отопление и ГВС</li>
      </div>
    </div>
    <div class="product_buttons">
      <div class="product_icons">
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
              <h2>Электрический котел Baxi 45кВт</h2>
              <div class="product_photos"/>
              <v-divider/>
              <div class="detail_card_buttons">
                <div>
                  <SelectStyled
                    :is-solo="true"
                    :placeholder="'Выберите действие'"
                  />
                </div>
                <div @click="closeModal">
                  <ButtonStyled
                    :local-text="'Закрыть'"
                    local-class="style_close"
                  />
                </div>
              </div>
            </v-card>
          </v-dialog>
        </TooltipStyled>
        <TooltipStyled
          :title="'Перейти в Яндекс Маркет'"
          :is-top="true"
        >
          <v-icon size="36">
            mdi-heart-outline
          </v-icon>
        </TooltipStyled>
        <TooltipStyled
          :title="'Подробнее об эксплуатации'"
          :is-top="true"
        >
          <v-icon size="36">
            mdi-file-cog-outline
          </v-icon>
        </TooltipStyled>
      </div>
      <div class="product_function_btn">
        <SelectStyled
          class=""
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
  data() {
    return {
      showModal: false,
    }
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
    .product_function_btn{
      margin-top: auto;
    }
  }
}
.empty_placeholder{
  background-color: #D9D9D9;
  min-width: 200px;
  min-height: 140px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #FFFFFF;
  font-size: 1.3em;
}
.detail_card_product{
  display: inline-grid;
  width: 675px;
  height: 700px;
  padding: 20px;
  .detail_card_buttons {
    display: flex;
    justify-content: space-between;
    align-items: end;
  }
}
</style>
