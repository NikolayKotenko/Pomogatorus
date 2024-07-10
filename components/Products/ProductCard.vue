<template>
  <div class="product_card_wrapper" @click="$store.commit('NomenclatureModule/set_selected_product', data.id)">
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
        <!--        <AddToFavoriteNomenclatures -->
        <!--          :favorite-object="favoriteData" -->
        <!--        /> -->
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
      <div class="card_footer" @click="$event.stopPropagation()">
        <div class="product_price">
          1234₽
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



        <!--        <div class="product_icons"> -->
        <!--          &lt;!&ndash; Модальное окно. Детальная карточка товара &ndash;&gt; -->
        <!--          <TooltipStyled -->
        <!--            :is-top="true" -->
        <!--            :title="'Подробнее о товаре'" -->
        <!--          > -->
        <!--            <v-dialog -->
        <!--              v-model="showModal" -->
        <!--              width="700" -->
        <!--            > -->
        <!--              <template #activator="{ on, attrs }"> -->
        <!--                <v-icon -->
        <!--                  size="36" -->
        <!--                  v-bind="attrs" -->
        <!--                  color="#000000" -->
        <!--                  v-on="on" -->
        <!--                  @click="getFilteredListNomenclaturesByFamily(data)" -->
        <!--                > -->
        <!--                  mdi-list-box-outline -->
        <!--                </v-icon> -->
        <!--              </template> -->

        <!--              <v-card class="detail_card_product"> -->
        <!--                &lt;!&ndash; Семейство Оборудования &ndash;&gt; -->
        <!--                <div class="header"> -->
        <!--                  <div class="family_name"> -->
        <!--                    <span>Семейство:</span> -->
        <!--                    <div class="card_name"> -->
        <!--                      {{ data._family.name }} -->
        <!--                    </div> -->
        <!--                  </div> -->
        <!--                  <AddToFavoriteNomenclatures -->
        <!--                    :favorite-object="favoriteData" -->
        <!--                  /> -->
        <!--                </div> -->


        <!--                &lt;!&ndash; Фотографии Оборудования &ndash;&gt; -->
        <!--                <div class="product_photos"> -->
        <!--                  <ViewerStyled -->
        <!--                    :images="data._family.photos" -->
        <!--                    class="photos_container" -->
        <!--                  > -->
        <!--                    <img -->
        <!--                      v-for="(image, index) in data._family.photos" -->
        <!--                      :key="index" -->
        <!--                      :src="image.url" -->
        <!--                      alt="" -->
        <!--                      class="photo" -->
        <!--                    > -->
        <!--                  </ViewerStyled> -->
        <!--                  <div class="main_photo_wrapper"> -->
        <!--                    <v-img -->
        <!--                      :src="getMainProductPhoto" -->
        <!--                      class="main_photo" -->
        <!--                      contain -->
        <!--                    /> -->
        <!--                  </div> -->
        <!--                </div> -->

        <!--                <v-divider/> -->

        <!--                &lt;!&ndash; Модели Оборудования &ndash;&gt; -->
        <!--                <div class="family_slider"> -->
        <!--                  <span>Модели:</span> -->
        <!--                  <v-tabs -->
        <!--                    show-arrows -->
        <!--                    color="#000000" -->
        <!--                    class="slider" -->
        <!--                  > -->
        <!--                    <v-tabs-slider color="#95D7AE"/> -->
        <!--                    <v-tab -->
        <!--                      v-for="(item, index) in listFamilyNomenclatures" -->
        <!--                      :key="index" -->
        <!--                    > -->
        <!--                      {{ item.name }} -->
        <!--                    </v-tab> -->
        <!--                    <v-tab-item/> -->
        <!--                  </v-tabs> -->
        <!--                </div> -->
        <!--                &lt;!&ndash; Инфорамация об Оборудовании &ndash;&gt; -->
        <!--                <div class="product_detail_info"> -->
        <!--                  <v-tabs -->
        <!--                    color="#95D7AE" -->
        <!--                    vertical -->
        <!--                    style="display: flex; flex-direction: row-reverse;" -->
        <!--                  > -->
        <!--                    <v-tab :key="0"> -->
        <!--                      Описание -->
        <!--                    </v-tab> -->
        <!--                    <v-tab :key="1"> -->
        <!--                      Характеристики -->
        <!--                    </v-tab> -->
        <!--                    <v-tab :key="2"> -->
        <!--                      Документация -->
        <!--                    </v-tab> -->
        <!--                    <v-tab-item :key="0"> -->
        <!--                      <div> -->
        <!--                        <span class="product_description"> -->
        <!--                          {{ data._family.description }} -->
        <!--                        </span> -->
        <!--                      </div> -->
        <!--                    </v-tab-item> -->
        <!--                    <v-tab-item :key="1"> -->
        <!--                      <div class="product_characteristics"> -->
        <!--                        <div class="switch"> -->
        <!--                          <v-switch color="#95D7AE" hide-details/> -->
        <!--                          <span>Только различающиеся характеристики</span> -->
        <!--                        </div> -->
        <!--                        <li>Артикул: {{ data.vendor_code }}</li> -->
        <!--                        <li -->
        <!--                          v-for="(character, index) in data._nomenclature_characteristics" -->
        <!--                          :key="index" -->
        <!--                        > -->
        <!--                          {{ character.name }}: {{ character.value }}{{ character.postfix }} -->
        <!--                        </li> -->
        <!--                      </div> -->
        <!--                    </v-tab-item> -->
        <!--                    <v-tab-item :key="2"> -->
        <!--                      <div class="product_documents"/> -->
        <!--                    </v-tab-item> -->
        <!--                  </v-tabs> -->
        <!--                </div> -->
        <!--                <ButtonStyled -->
        <!--                  :local-class="'style_close'" -->
        <!--                  :local-text="'Закрыть'" -->
        <!--                  @click-button="closeModal" -->
        <!--                /> -->
        <!--              </v-card> -->
        <!--            </v-dialog> -->
        <!--          </TooltipStyled> -->
        <!--        </div> -->
      </div>
    </div>

    <!-- Избранное -->
    <ProductModal v-if="data.id === $store.state.NomenclatureModule.idSelectedProduct" :current-product="data"/>
  </div>
</template>

<script>
import SelectStyled from '../Common/SelectStyled.vue';
import TooltipStyled from '../Common/TooltipStyled.vue';
import ButtonStyled from '../Common/ButtonStyled.vue';
import ViewerStyled from '../Common/ViewerStyled.vue';
import IconTooltip from '../Common/IconTooltip.vue';
import AddToFavoriteNomenclatures from '../Common/AddToFavoriteNomenclatures.vue';
import ProductModal from './ProductModal.vue'
import { FavoriteNomenclature } from '~/helpers/constructors';

export default {
  name: 'ProductCard',
  components: { ProductModal, ViewerStyled, ButtonStyled, TooltipStyled, SelectStyled, IconTooltip, AddToFavoriteNomenclatures },
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
      listFamilyNomenclatures: [],
      localCurrentProduct: {},
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
    stateCurrentNomenclature() {
      return this.$store.state.NomenclatureModule.listFavoriteNomenclature.some((elem) => elem.id_nomenclature === this.data.id)
    },
  },
  watch: {
    '$store.state.Objects.currentObject.id':{
      async handler(idCurrentObject) {
        if (!idCurrentObject) return false;

        await this.$store.dispatch('NomenclatureModule/getListFavoriteNomenclatureByUserAndObjectId');
      }
    },
  },
  async mounted() {
    await this.$store.dispatch('NomenclatureModule/getListFavoriteNomenclatureByUserAndObjectId');
  },
  methods: {
    changeFavoriteProduct() {
      this.$toast.success('Добавленно в избранное', { duration: 5000 });
    },
    openProductCard() {
      this.$store.dispatch('NomenclatureModule/openProductModal')
    },
    closeModal() {
      this.showModal = false;
    },
    getFilteredListNomenclaturesByFamily(objData) {
      this.listFamilyNomenclatures = this.$store.state.NomenclatureModule.listNomenclature
        .filter((elem) =>
          elem?._family?.id === objData?._family?.id
        )
    },
    async addToObject() {
      await this.$store.dispatch('NomenclatureModule/setFavoritesNomenclatureByObject', this.data.id)

      this.$toast.success('Оборудование добавленно на объект')
    },
    async deleteFromObject() {
      await this.$store.dispatch('NomenclatureModule/deleteOneFavoriteNomenclature', this.data.id)

      this.$toast.success('Оборудование удаленно из объекта')
    },

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
  background-color: #FFFFFF;
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

  .card_footer {
    display: flex;
    justify-content: flex-end;
    grid-column-gap: 20px;
    align-items: center;
    margin-top: auto;
    .product_price {
      font-size: 1.25em;
      font-weight: 600;
    }
    .add_to_object_style {
      border-radius: 15px;
      background-color: #DDDDDD;
      box-shadow: none;
      font-weight: 600;
      border: none;
      &:hover {
        box-shadow: $shadowBox;
      }
    }
    .active_add_btn {
      border-radius: 15px;
      background-color: #FF6347;
      color: #FFFFFF;
      box-shadow: none;
      font-weight: 600;
      border: none;
      &:hover {
        box-shadow: $shadowBox;
      }
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

</style>

<style lang="scss">

.v-input--selection-controls {
  margin: 0;
  padding: 0;
}
</style>
