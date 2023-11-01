<template>
  <div class="card_wrapper">
    <div class="card_header">
      <div class="title_and_equip">
        <li class="service_title">
          - {{ serviceObject.ServiceData.name }}
          <TooltipStyled
            :title="'Описание услуги'"
          >
            <v-menu
              offset-overflow
              offset-y
            >
              <template #activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  color="#5D80B5"
                  v-on="on"
                >
                  mdi-help-circle-outline
                </v-icon>
              </template>
              <v-list>
                <div class="explain_info">
                  <span>{{ serviceObject.ServiceData.description }}</span>
                </div>
              </v-list>
            </v-menu>
          </TooltipStyled>
        </li>
        <div class="equipment">
          <div class="add_equipment">
            <TooltipStyled
              :is-top="true"
              :title="'Добавить оборудование'"
            >
              <v-icon
                color="#95D7AE"
                size="22"
              >
                mdi-plus-circle-outline
              </v-icon>
            </TooltipStyled>
            <v-combobox
              :items="$store.state.NomenclatureModule.listNomenclature"
              :item-text="'name'"
              :item-value="'id'"
              :hide-details="true"
              class="search_equipment"
              clearable
              label="Добавить оборудование"
              outlined
              placeholder="Добавить оборудование"
              return-object
              solo
            />
          </div>
          <!--      <div class="equipment_list"> -->
          <!--        <li -->
          <!--          v-for="(item, index) in serviceObject.ServiceData.ids_nominclatures" -->
          <!--          :key="index" -->
          <!--          class="name_and_article" -->
          <!--        > -->
          <!--          {{ item.name }} -->
          <!--        </li> -->
          <!--      </div> -->
        </div>
      </div>
      <div class="service_info">
        <v-text-field
          class="price_field"
          label="Цена"
          placeholder="Цена"
          outlined
          hide-details
          @change="$emit('update-price-field', $event)"
        />
        <InputStyled
          :class="'styleQuantityField'"
          :data="serviceObject.quantity"
          :is-placeholder="'Кол-во'"
          :is-label="'Кол-во'"
          :is-outlined="true"
          class="quantity_field"
        />
      </div>
      <v-dialog
        v-model="showDeleteOneServiceModal"
        width="600"
      >
        <template #activator="{ on, attrs }">
          <TooltipStyled :title="'Удалить услугу'">
            <v-icon
              size="32"
              color="#8A8784"
              v-bind="attrs"
              v-on="on"
            >
              mdi-delete-outline
            </v-icon>
          </TooltipStyled>
        </template>
        <v-card class="delete_service_modal">
          <div class="delete_service_header">
            <span class="header_title">Удаление услуги</span>
            <v-icon large @click="closeDeleteOneServiceModal">
              mdi-close
            </v-icon>
          </div>
          <span>
            Вы действительно хотите удалить услугу "{{ serviceObject.ServiceData.name }}"?
          </span>
          <div class="delete_service_buttons">
            <ButtonStyled
              :local-text="'Подтвердить'"
              :local-class="'invite_button style_button'"
              @click-button="$emit('delete-one-service')"
            />
            <ButtonStyled
              :local-text="'Отмена'"
              :local-class="'style_close'"
              @click-button="closeDeleteOneServiceModal"
            />
          </div>
        </v-card>
      </v-dialog>
    </div>

    <v-divider style="margin-top: 15px; border-color: #8A8784 !important;"/>
  </div>
</template>

<script>
import index from 'v-viewer';
import InputStyled from '../Common/InputStyled.vue';
import TooltipStyled from '../Common/TooltipStyled.vue';
import { Service } from '../../helpers/constructors';
import ButtonStyled from '../Common/ButtonStyled.vue';

export default {
  name: 'ServiceCard',
  components: { ButtonStyled, TooltipStyled, InputStyled },
  props: {
    serviceObject: {
      type: Object,
      default: () => new Service(),
    },

  },
  data() {
    return {
      showDeleteOneServiceModal: false,
    }
  },
  computed: {
    index() {
      return index
    }
  },
  methods: {
    openDeleteOneServiceModal() {
      this.showDeleteOneServiceModal = true
    },

    closeDeleteOneServiceModal() {
      this.showDeleteOneServiceModal = false
    },

  },
}
</script>

<style lang="scss" scoped>
.card_wrapper {
  display: grid;
  grid-row-gap: 10px;
  margin-top: 15px;
  .card_header {
    display: grid;
    grid-column-gap: 20px;
    grid-template-columns: 2fr 0.8fr 0.1fr;

    .title_and_equip {
      display: grid;
      grid-row-gap: 10px;
      .service_title {
        font-size: 1.3em;
        display: inline-flex;
        grid-column-gap: 10px;
      }
    }
    .service_info {
      display: grid;
      justify-items: flex-end;
      grid-row-gap: 20px;

      .price_field {
        max-width: 150px;
      }
      .quantity_field {
        max-width: 90px;
      }

    }
  }
  .equipment {
    display: grid;
    grid-row-gap: 10px;
    .add_equipment {
      display: inline-flex;
      align-items: center;
      grid-column-gap: 10px;
      .search_equipment {
        max-width: 330px;
      }
    }
    .name_and_article {
      font-weight: 700;
      text-decoration: underline;
    }
  }
}

.delete_service_modal {
  padding: 20px;
  display: grid;
  grid-row-gap: 20px;
  .delete_service_header {
    display: flex;
    justify-content: space-between;
    font-size: 1.3em;
    font-weight: 600;
  }
  .delete_service_buttons {
    display: flex;
    justify-content: space-between;
  }
}
</style>

<style lang="scss">
.search_equipment {
  .v-input__control {
    min-height: 30px !important;
    .v-input__slot {
      min-height: 30px !important;
    }
  }
}
.price_field {
  .v-input__control {
    min-height: 40px !important;
    .v-input__slot {
      min-height: 40px !important;
    }
  }
}
</style>
