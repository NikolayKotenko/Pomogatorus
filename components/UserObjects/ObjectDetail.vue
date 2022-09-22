<template>
  <v-card>
    <v-card-title class='detail_object_title d-flex justify-space-between'>
           <span>
             Объект: {{ object_data.address }}
            </span>
      <v-icon large @click='closeDetail'>mdi-close</v-icon>
    </v-card-title>
    <v-card-text class='detail_object_wrapper'>
      <h3>Параметры:</h3>
      <div v-for='(param, index) in paramsDetail' class='detail_object_block'>
          <span class='detail_object_block__count'>
            {{ index + 1 }}
          </span>
        <span v-if='!isMobile' class='detail_object_block__title'>
            {{ param.value }}
          </span>
        <div v-if='!isMobile' class='detail_object_block__divider'></div>
        <div
          :class='{
              full_size_value: param.canEdit && !isMobile,
            }'
          class='detail_object_block__value'
        >
          <template v-if='param.canEdit'>
            <v-text-field
              v-model='refactored_object_data[param.key]'
              :label="isMobile ? param.value : ''"
              :placeholder='`Введите ${param.value}`'
              :solo='!isMobile'
              dense
              hide-details
            >
            </v-text-field>
          </template>
          <template v-else>
            <span v-if='isMobile'>{{ `${param.value} - ${object_data[param.key]}` }}</span>
            <span v-else> {{ object_data[param.key] }} </span>
          </template>
        </div>
      </div>
    </v-card-text>
    <v-card-actions class='detail_obj_footer'>
      <v-btn color='red lighten-1' text @click='closeDetail'> Закрыть</v-btn>
      <v-btn color='green lighten-1' outlined @click='saveData'> Сохранить</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Request from '../../services/request'

export default {
  name: 'ObjectDetail',
  props: ['object_data'],
  data: () => ({
    paramsDetail: [
      {
        key: 'address',
        value: 'Адрес',
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
        key: 'created_at',
        value: 'Дата создания',
        canEdit: false
      },
      {
        key: 'updated_at',
        value: 'Дата изменения',
        canEdit: false
      }
    ]
  }),
  mounted() {
  },
  computed: {
    isMobile() {
      return this.$device.isMobile
    },
    refactored_object_data() {
      let refactored = {}
      for (let key in this.object_data) {
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
  methods: {
    isJson(str) {
      try {
        JSON.parse(str)
      } catch (e) {
        return false
      }
      return true
    },
    closeDetail() {
      this.$emit('closeDetail')
    },
    async saveData() {
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
        basement_area: !!this.refactored_object_data.basement_area ? this.refactored_object_data.basement_area : '',
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
      this.closeDetail()
    }
  }
}
</script>

<style lang='scss' scoped>
@media only screen and (max-width: 600px) {
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
  min-width: 300px;
}

.detail_obj_footer {
  display: flex;
  justify-content: space-between;
  position: sticky;
  bottom: 0;
  background: #ffffff;
}

::v-deep .v-input__control {
  min-height: 30px !important;
  font-size: 14px !important;
}
</style>
