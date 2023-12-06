<template>
  <v-card class="card_wrapper" elevation="3">
    <div class="card_header">
      <div class="title_and_equip">
        <li class="service_title">
          {{ iterationKey }}. {{ serviceObject.service_data.name }}
          <TooltipStyled
            :title="'Описание услуги'"
          >
            <v-menu
              offset-overflow
              offset-y
            >
              <template #activator="{ on, attrs }">
                <v-icon
                  color="#5D80B5"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-help-circle-outline
                </v-icon>
              </template>
              <v-list>
                <div class="explain_info">
                  <span>{{ serviceObject.service_data.description }}</span>
                </div>
              </v-list>
            </v-menu>
          </TooltipStyled>
        </li>
        <div v-if="isEquipmentExist" class="equipment">
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
              :hide-details="true"
              :item-text="'name'"
              :item-value="'id'"
              :items="$store.state.NomenclatureModule.listNomenclature"
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
          <!--          v-for="(item, index) in serviceObject.service_data.ids_nominclatures" -->
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
          ref="price_field"
          :color="(delayUpdatingData) ? 'green' : 'blue'"
          :hide-details="!delayUpdatingData"
          :hint="'Обновлено - ' + serviceObject.created_at_minutes"
          :persistent-hint="delayUpdatingData"
          :value="serviceObject.price"
          class="price_field"
          dense
          height="40"
          label="Цена услуги"
          outlined
          persistent-placeholder
          placeholder="Договорная"
          type="number"
          @input="$emit('update-price-field', $event)"
        >
          <template #append>
            <DropDownMenuStyled>
              <template #icon>
                <IconTooltip
                  :icon-text="'mdi-chart-timeline-variant'"
                  :text-tooltip="'sdfsdfdsfsfs'"
                />
              </template>
              <template #content>
                <div>DADADADADADAD</div>
              </template>
            </DropDownMenuStyled>
          </template>
        </v-text-field>
        <InputStyled
          v-if="isQuantityExist"
          :class="'styleQuantityField'"
          :data="serviceObject.quantity"
          :is-label="'Кол-во'"
          :is-outlined="true"
          :is-placeholder="'Кол-во'"
          class="quantity_field"
        />
      </div>
      <v-dialog
        v-model="$store.state.UserSettings.showDeleteOneServiceModal"
        width="600"
      >
        <template #activator="{ on, attrs }">
          <TooltipStyled :title="'Удалить услугу'">
            <v-icon
              color="#8A8784"
              size="32"
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
            <v-icon large @click="$store.commit('UserSettings/changeStateDeleteServiceModal', false)">
              mdi-close
            </v-icon>
          </div>
          <span>
            Вы действительно хотите удалить услугу "{{ serviceObject.service_data.name }}"?
          </span>
          <div class="delete_service_buttons">
            <ButtonStyled
              :local-class="'invite_button style_button'"
              :local-text="'Подтвердить'"
              @click-button="$emit('delete-one-service')"
            />
            <ButtonStyled
              :local-class="'style_close'"
              :local-text="'Отмена'"
              @click-button="$store.commit('UserSettings/changeStateDeleteServiceModal', false)"
            />
          </div>
        </v-card>
      </v-dialog>
    </div>
  </v-card>
</template>

<script>
import index from 'v-viewer';
import InputStyled from '../Common/InputStyled.vue';
import TooltipStyled from '../Common/TooltipStyled.vue';
import { Service } from '../../helpers/constructors';
import ButtonStyled from '../Common/ButtonStyled.vue';
import IconTooltip from '../Common/IconTooltip.vue';
import DropDownMenuStyled from '~/components/Common/DropDownMenuStyled';

export default {
  name: 'ServiceCard',
  components: { DropDownMenuStyled, ButtonStyled, TooltipStyled, InputStyled, IconTooltip },
  props: {
    serviceObject: {
      type: Object,
      default: () => new Service()
    },
    isEquipmentExist: {
      type: Boolean,
      default: true
    },
    isQuantityExist: {
      type: Boolean,
      default: true
    },
    iterationKey: {
      type: Number,
      default: 1
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isErrorMessagesPrice: [
        value => (!!Number.parseInt(value) || value === '' || value === null) || 'Должно быть числом'
      ],
      delayUpdatingData: false
    };
  },
  computed: {
    index() {
      return index;
    }
  },
  watch: {
    'serviceObject.id': {
      handler(newV, oldV) {
        if (!newV) return false;
        if (newV === oldV) return false;
        if (oldV !== this.$store.state.UserSettings.updatedEntryPrice) return false;

        this.setDelayUpdatingData();
      }
    }
  },
  methods: {
    setDelayUpdatingData() {
      this.delayUpdatingData = true;
      this.$refs.price_field.focus();

      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.delayUpdatingData = false;
      }, 6000);
    }
  }
};
</script>

<style lang="scss" scoped>
.card_wrapper {
  display: grid;
  //grid-row-gap: 10px;
  padding: 15px 10px;

  .card_header {
    display: grid;
    grid-column-gap: 20px;
    grid-template-columns: 2fr 0.8fr 0.1fr;
    align-items: center;

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
      //align-items: center;
      grid-row-gap: 1em;

      .price_field {
        max-width: 150px;

        .v-messages__message {
          color: green !important;
          background: red;
        }
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
      //align-items: center;
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

.price_field .v-messages__message {
  color: green;
}
</style>
