<template>
  <div class="products_wrapper">
    <span class="main_title">Рекомендуемое оборудование</span>
    <v-divider style="margin-bottom: 20px"/>
    <v-slide-group
      show-arrows
    >
      <v-slide-item
        v-for="(item) in $store.state.NomenclatureModule.listNomenclature"
        :key="item.id"
      >
        <v-hover v-slot="{ hover }">
          <div class="item_container">
            <v-img
              class="img_product"
              src="https://baxi.ru/photo/ECO_Nova_004.png"
            >
              <v-expand-transition>
                <div
                  v-if="hover"
                  class="hover_content"
                >
                  <div class="info_container">
                    <span class="title">{{ item.name }}</span>
                    <div class="options_container">
                      <span class="options">Артикул: {{ item.vendor_code }}</span>
                      <span
                        v-for="(character) in item._nomenclature_characteristics"
                        :key="character.id"
                        class="options"
                      >{{ character.name }}: {{ character.value }}{{ character.postfix }}
                      </span>
                    </div>
                    <div class="icons">
                      <TooltipStyled
                        :title="'Добавить в избранное'"
                      >
                        <v-icon
                          color="#FFFFFF"
                          large
                          @click="changeFavoriteProduct"
                        >
                          mdi-heart-outline
                        </v-icon>
                      </TooltipStyled>

                      <TooltipStyled
                        :title="'Добавить в купленное'"
                      >
                        <v-icon
                          color="#ffffff"
                          large
                          @click="addBoughtProduct"
                        >
                          mdi-cart-check
                        </v-icon>
                      </TooltipStyled>

                      <TooltipStyled
                        :title="'Добавить в установленное'"
                      >
                        <v-icon
                          color="#ffffff"
                          large
                          @click="addInstalledProduct"
                        >
                          mdi-wrench-check-outline
                        </v-icon>
                      </TooltipStyled>
                    </div>
                  </div>
                </div>
              </v-expand-transition>
            </v-img>
          </div>
        </v-hover>
      </v-slide-item>
    </v-slide-group>
  </div>
</template>
<script>
import TooltipStyled from './TooltipStyled.vue';

export default {
  name: 'ProductsWidget',
  components: { TooltipStyled },
  async mounted() {
    await this.$store.dispatch('NomenclatureModule/getListNomenclature')
  },
  methods: {
    changeFavoriteProduct() {
      this.$toast.success('Добавленно в избранное', { duration: 5000 })
    },
    addBoughtProduct() {
      this.$toast.success('Добавленно в купленное', { duration: 5000 })
    },
    addInstalledProduct() {
      this.$toast.success('Добавленно в установленное', { duration: 5000 })
    }
  }
}
</script>

<style lang="scss" scoped>
.products_wrapper {
  padding: 20px 0;

  .main_title{
    font-size: 1.2em;
    font-weight: 500;
  }
  .item_container {
    margin: 12px;
    width: 250px;
    height: 250px;
    .img_product {
      background-size: cover;
      height: 100%;
      border-radius: 5px;
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    }
    .hover_content {
      height: 100%;
      background: rgba(0, 0, 0, 0.50);
      display: flex;
      align-items: center;
      bottom: 0;
      justify-content: center;
      border-radius: 5px;
      .info_container {
        display: grid;
        grid-row-gap: 1em;
        .title{
          color: #FFFFFF;
          font-size: 1em;
        }
        .options_container {
          display: grid;
          .options{
            color: #FFFFFF;
            font-size: 0.8em;
          }
        }
        .icons{
          display: flex;
          grid-column-gap: 1em;
        }
      }
    }
  }
}
</style>
