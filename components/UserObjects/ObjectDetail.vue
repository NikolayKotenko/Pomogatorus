<template>
  <div class="modal_wrapper">
    <div class="detail_object_wrapper px-4">
      <div v-for="(param, index) in paramsDetail" class="detail_object_block">
        <span class="detail_object_block__count">
          {{ index + 1 }}
        </span>
        <div
          :class="{full_size_value: param.canEdit && !isMobile}"
          class="detail_object_block__value"
        >
          <template v-if="param.canEdit">
            <VTextField
              v-model="refactored_object_data[param.key]"
              :placeholder="inputPlaceholder(param)"
              dense
              hide-details
              @focus="isFocused = param.key"
              @focusout="isFocused = null"
            />
          </template>
          <template v-else>
            <span> {{ object_data[param.key] }} </span>
          </template>
        </div>
      </div>
    </div>
    <div class="detail_obj_footer">
      <ButtonStyled
        local-class="style_button"
        local-text="Сохранить изменения"
        @click-button="saveData"
      />
      <ButtonStyled
        local-class="style_button"
        local-text="Скачать PDF"
      />
      <ButtonStyled
        local-class="style_close"
        local-text="Закрыть"
        @click-button="closeDetail"
      />
    </div>
  </div>
</template>

<script>
import Request from '../../services/request'
import InputStyled from '../Common/InputStyled'
import ButtonStyled from '../Common/ButtonStyled.vue'

export default {
  name: 'ObjectDetail',
  components: { ButtonStyled },
  // eslint-disable-next-line vue/prop-name-casing
  props: ['object_data'],
  data: () => ({
    paramsDetail: [
      {
        key: 'address',
        value: 'Адрес',
        canEdit: true
      },
      {
        key: 'name',
        value: 'Псевдоним',
        canEdit: true
      },
      {
        key: 'notes',
        value: 'Заметки',
        canEdit: true
      },
      {
        key: 'id_type_object',
        value: 'Тип объекта',
        canEdit: true
      },
      {
        key: 'id_floor',
        value: 'Этажность',
        canEdit: true
      },
      {
        key: 'id_wall',
        value: 'Тип стен',
        canEdit: true
      },
      {
        key: 'id_fuel_current',
        value: 'Тип топлива',
        canEdit: true
      },
      {
        key: 'id_fuel_reserve',
        value: 'Тип топлива резервный',
        canEdit: true
      },
      {
        key: 'id_fuel_future',
        value: 'Тип топлива перспективный',
        canEdit: true
      },
      {
        key: 'id_boiler_room',
        value: 'Расположение котельной',
        canEdit: true
      },
      {
        key: 'number_of_bidets',
        value: 'Кол-во биде',
        canEdit: true
      },
      {
        key: 'number_of_baths',
        value: 'Кол-во ванн',
        canEdit: true
      },
      {
        key: 'number_of_showers',
        value: 'Кол-во душей',
        canEdit: true
      },
      {
        key: 'number_of_sinks',
        value: 'Кол-во раковин',
        canEdit: true
      },
      {
        key: 'number_of_toilets',
        value: 'Кол-во унитазов',
        canEdit: true
      },
      {
        key: 'id_cold_water_source',
        value: 'Источник холодной воды',
        canEdit: true
      },
      {
        key: 'dedicated_electrical_power',
        value: 'Выделенная электрическая мощность',
        canEdit: true
      },
      {
        key: 'heat_loss_total',
        value: 'Общие теплопотери',
        canEdit: true
      },
      {
        key: 'basement_area',
        value: 'Наличие подвала',
        canEdit: true
      },
      {
        key: 'heating_area',
        value: 'Отапливаемая площадь',
        canEdit: true
      },
      {
        key: 'total_area',
        value: 'Общая площадь',
        canEdit: true
      },
      {
        key: 'links_to_party_services',
        value: 'Ссылки на сторонние сервисы',
        canEdit: true
      },
      {
        key: 'created_at',
        value: 'Дата создания',
        canEdit: false
      },
      {
        key: 'updated_at',
        value: 'Дата изменения',
        canEdit: false
      }
    ],
    isUpdating: false,
    isFocused: null
  }),
  computed: {
    isMobile() {
      return this.$device.isMobile
    },
    refactored_object_data() {
      const refactored = {}
      for (const key in this.object_data) {
        if (this.isJson(this.object_data[key])) {
          if (this.isJson(JSON.parse(this.object_data[key]))) {
            refactored[key] = JSON.parse(JSON.parse(this.object_data[key]))
          } else {
            refactored[key] = JSON.parse(this.object_data[key])
          }
        } else {
          refactored[key] = this.object_data[key]
        }
      }
      return refactored
    }
  },
  mounted() {
  },
  methods: {
    inputPlaceholder(item) {
      if (this.isFocused === item.key) {
        return ''
      }
      return `Введите ${item.value}`
    },

    isJson(str) {
      try {
        JSON.parse(str)
      } catch (e) {
        return false
      }
      return true
    },
    closeDetail() {
      this.$emit('close-detail')
    },
    async saveData() {
      this.isUpdating = true

      await Request.put(this.$store.state.BASE_URL + `/entity/objects/${this.object_data.id}`, {
        id_region: parseInt(this.refactored_object_data.id_region)
          ? parseInt(this.refactored_object_data.id_region)
          : 0,
        lat: this.refactored_object_data.id_region ? parseInt(this.object_data.id_region) : 0,
        long: this.refactored_object_data.long ? parseInt(this.object_data.long) : 0,
        address: this.refactored_object_data.address,
        hide_manager_geotag: this.refactored_object_data.hide_manager_geotag,
        notes: this.refactored_object_data.notes,
        id_type_object: parseInt(this.refactored_object_data.id_type_object)
          ? parseInt(this.refactored_object_data.id_type_object)
          : 0,
        id_floor: parseInt(this.refactored_object_data.id_floor) ? parseInt(this.refactored_object_data.id_floor) : 0,
        id_wall: parseInt(this.refactored_object_data.id_wall) ? parseInt(this.object_data.id_wall) : 0,
        id_fuel_current: parseInt(this.refactored_object_data.id_fuel_current)
          ? parseInt(this.refactored_object_data.id_fuel_current)
          : 0,
        id_fuel_reserve: parseInt(this.refactored_object_data.id_fuel_reserve)
          ? parseInt(this.refactored_object_data.id_fuel_reserve)
          : 0,
        id_fuel_future: parseInt(this.refactored_object_data.id_fuel_future)
          ? parseInt(this.refactored_object_data.id_fuel_future)
          : 0,
        id_boiler_room: parseInt(this.refactored_object_data.id_boiler_room)
          ? parseInt(this.refactored_object_data.id_boiler_room)
          : 0,
        id_cold_water_source: parseInt(this.refactored_object_data.id_cold_water_source)
          ? parseInt(this.refactored_object_data.id_cold_water_source)
          : 0,
        total_area: this.refactored_object_data.total_area ? this.refactored_object_data.total_area : '',
        heating_area: this.refactored_object_data.heating_area ? this.refactored_object_data.heating_area : '',
        basement_area: this.refactored_object_data.basement_area ? this.refactored_object_data.basement_area : '',
        heat_loss_total: this.refactored_object_data.heat_loss_total ? this.refactored_object_data.heat_loss_total : '',
        dedicated_electrical_power: this.refactored_object_data.dedicated_electrical_power
          ? this.refactored_object_data.dedicated_electrical_power
          : '',
        number_of_toilets: this.refactored_object_data.number_of_toilets
          ? this.refactored_object_data.number_of_toilets
          : '',
        number_of_sinks: this.refactored_object_data.number_of_sinks ? this.refactored_object_data.number_of_sinks : '',
        number_of_showers: this.refactored_object_data.number_of_showers
          ? this.refactored_object_data.number_of_showers
          : '',
        number_of_baths: this.refactored_object_data.number_of_baths ? this.refactored_object_data.number_of_baths : '',
        number_of_bidets: this.refactored_object_data.number_of_bidets
          ? this.refactored_object_data.number_of_bidets
          : ''
      })
      this.isUpdating = false
      this.closeDetail()
    }
  }
}
</script>

<style lang='scss' scoped>
@media only screen and (max-width: 1080px) {
  .detail_object_wrapper {
    row-gap: 25px !important;
    justify-content: center !important;
  }
  .detail_object_block {
    &__value {
      flex: 1 !important;
    }
  }
}

.detail_object_title {
  word-break: normal !important;
}

.detail_object_wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 15px;
}

.detail_object_block {
  display: flex;
  column-gap: 10px;
  align-items: flex-end;

  &__divider {
    flex: 1;
    border-bottom: 1px dashed darkgrey;
    margin-bottom: 4px;
  }

  &__value {
  }
}

.full_size_value {
  flex: 1;
}

.detail_obj_footer {
  display: flex;
  position: sticky;
  bottom: 0;
  background: #ffffff;
  width: 100%;
  margin: 0 10px;
  padding: 1em 0 2em 0;
  grid-column-gap: 2em;

}

::v-deep .v-input__control {
  min-height: 30px !important;
  font-size: 14px !important;
}

</style>
