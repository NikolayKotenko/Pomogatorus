<template>
  <v-card class="card_wrapper">
    <div class="card_header">
      <div class="title_and_equip">
        <li class="service_title">
          <section>{{ iterationKey }}.</section>
          <section>{{ serviceObject.service_data.name }}</section>
          <DropDownMenuStyled>
            <template #icon>
              <IconTooltip
                :icon-text="'mdi-help-circle-outline'"
                :text-tooltip="'Описание услуги'"
              />
            </template>
            <template #content>
              <span>{{ serviceObject.service_data.description }}</span>
            </template>
          </DropDownMenuStyled>
        </li>
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
            suffix="₽"
            type="number"
            @input="$emit('update-price-field', $event)"
          >
            <template #append>
              <DropDownMenuStyled
                :is-left="true"
                :nudge-bottom="30"
                :nudge-right="15"
              >
                <template #icon>
                  <IconTooltip
                    :icon-text="'mdi-chart-timeline-variant'"
                    :text-tooltip="'История цен'"
                  />
                </template>
                <template #content>
                  <div class="additional_data">
                    <h4 class="header_additional_data">
                      <span>
                        {{ listAdditionalDataServices.length ?
                          "Ваша история цены на услугу:" :
                          "Здесь появится ваша история цен." }}
                      </span>
                    </h4>
                    <div class="wrapper_additional_data">
                      <div
                        v-for="(item, index) in listAdditionalDataServices"
                        :key="index"
                        class="row_additional_data"
                      >
                        <section> - {{ item.price }} ₽</section>
                        <section class="last_entry">
                          {{ item.created_at_date }}
                        </section>
                      </div>
                    </div>
                  </div>
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
            @input="$emit('update-quantity-input', $event)"
          />
        </div>
        <IconTooltip
          :color-icon="'#8A8784'"
          :icon-text="'mdi-delete-outline'"
          :size-icon="'32'"
          :text-tooltip="'Удалить услугу'"
          @click-icon="showDeleteOneServiceModal = true"
        />
      </div>
      <div v-if="isEquipmentExist" class="equipment">
        <span style="font-weight: 700;">Выберите оборудование: </span>
        <div class="add_equipment">
          <UniversalAddInput
            :list-items-available-to-add="
              $store.state.NomenclatureModule.listNomenclature
            "
            style="width: 500px"
          />
        </div>
      </div>
    </div>

    <v-dialog
      v-model="showDeleteOneServiceModal"
      width="600"
    >
      <v-card class="delete_service_modal">
        <div class="delete_service_header">
          <span class="header_title">Удаление услуги</span>
          <v-icon large @click="showDeleteOneServiceModal = false">
            mdi-close
          </v-icon>
        </div>
        <span>
          Вы действительно хотите удалить услугу "{{ serviceObject.service_data.name }}"?
        </span>
        <div class="delete_service_buttons">
          <ButtonStyled
            :is-loading="localLoading || isLoading"
            :local-class="'invite_button style_button'"
            :local-text="'Подтвердить'"
            @click-button="localDeleteOneService"
          />
          <ButtonStyled
            :local-class="'style_close'"
            :local-text="'Отмена'"
            @click-button="showDeleteOneServiceModal = false"
          />
        </div>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import index from 'v-viewer';
import InputStyled from '../Common/InputStyled.vue';
import TooltipStyled from '../Common/TooltipStyled.vue';
import { Service } from '../../helpers/constructors';
import ButtonStyled from '../Common/ButtonStyled.vue';
import IconTooltip from '../Common/IconTooltip.vue';
import UniversalAddInput from '../Common/UniversalAddInput.vue'
import DropDownMenuStyled from '~/components/Common/DropDownMenuStyled';

export default {
  name: 'ServiceCard',
  components: { DropDownMenuStyled, ButtonStyled, TooltipStyled, InputStyled, IconTooltip, UniversalAddInput },
  props: {
    listAdditionalDataServices: {
      type: Array,
      default: () => []
    },
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
      delayUpdatingData: false,
      showDeleteOneServiceModal: false,
      localLoading: false
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
    localDeleteOneService() {
      this.$emit('delete-one-service', this.serviceObject);

      this.localLoading = true;
      setTimeout(() => {
        this.showDeleteOneServiceModal = false;
        this.localLoading = false;
      }, 1000);
    },
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
@import 'assets/styles/style';

.card_wrapper {
  display: grid;
  //grid-row-gap: 10px;
  padding: 1em;
  //height: 96px;
  transition: $transition;
  &:hover {
    background-color: $dull-yellow-color;
  }

  .card_header {
    display: grid;
    grid-row-gap: 1em;
    .title_and_equip {
      display: grid;
      align-items: center;
      grid-template-columns: 2fr 1.4fr 0.1fr;

      .service_title {
        font-size: 1.3em;
        display: inline-flex;
        grid-column-gap: 10px;
      }
      .service_info {
        display: flex;
        align-items: center;
        grid-column-gap: 1em;

        .price_field {
          max-width: 160px;
          width: 100%;

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


  }

  .equipment {
    display: grid;
    grid-row-gap: 10px;
    .add_equipment {
      display: inline-flex;
      grid-column-gap: 10px;
    }

    .name_and_article {
      font-weight: 700;
      text-decoration: underline;
    }
  }
}

.additional_data {
  .header_additional_data {
    margin-bottom: 2px;
    display: inline-flex;
    grid-column-gap: 10px;
  }

  .wrapper_additional_data {
    display: grid;
    grid-row-gap: 5px;
    margin-top: 10px;

    .row_additional_data {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-row-gap: 1em;

      .last_entry {
        margin-left: auto;
      }
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
