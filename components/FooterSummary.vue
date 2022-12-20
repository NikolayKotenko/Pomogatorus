<template>
  <v-footer
    v-if='$store.getters.stateAuth'
    :color="'#d3d3d3'"
    elevation='20'
    fixed
    outlined
    padless
  >
    <v-container class='wrapper_footer'>
      <div v-if='$store.state.AuthModule.userData.objects.length' class='wrapper_objects_list'>
        <span>Ваш объект заполнен на - 15 %</span>
        <v-select
          ref='selectObject'
          v-model='$store.state.currentObject'
          :items='$store.state.AuthModule.userData.objects'
          :menu-props='{
            closeOnContentClick: true,
            top: true,
            offsetY: true,
          }'
          clearable
          dense
          hide-details
          placeholder='Выберите объект'
          return-object
          solo
          @focusout='resetValues'
          @click:clear='clearValues'
        >
          <template v-slot:selection='data'>
            <div class='wrapper_selection_data'>
              <v-list-item-content class='wrap_item_data_slot'>
                <v-list-item-title>{{ (data.item.address) ? data.item.address : 'Нет адреса' }}</v-list-item-title>
                <v-list-item-subtitle>Объект описан: {{ data.item.created_at }}</v-list-item-subtitle>
                <v-list-item-subtitle> Площадь: {{ data.item.total_area }}</v-list-item-subtitle>
              </v-list-item-content>
            </div>
          </template>

          <template v-slot:item='{ item }'>
            <v-list-item @click="$store.commit('set_currentObject', item)">
              <v-list-item-content class='wrap_item_slot'>
                <v-list-item-title>{{ (item.address) ? item.address : 'Нет адреса' }}</v-list-item-title>
                <v-list-item-subtitle>Объект описан: {{ item.created_at }}</v-list-item-subtitle>
                <v-list-item-subtitle> Площадь: {{ item.total_area }}</v-list-item-subtitle>
                <v-list-item-subtitle>Готовность:</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-select>
      </div>
      <div v-else class='wrapper_add_object'>
        <v-text-field
          v-model='address'
          class='field_address'
          clearable
          dense
          flat
          hide-details
          placeholder='Введите адресс нового объекта'
        ></v-text-field>
        <v-btn color='primary' right small @click="$store.dispatch('createNewObject', address)">Добавить объект</v-btn>
      </div>
    </v-container>
  </v-footer>
</template>

<script>
import LoginAuth from '/components/frontLayouts/LoginAuth'
import { mapGetters } from 'vuex'
import _deepEqual from '../helpers/deepCompareObjects'
import _clone from '../helpers/deepClone'

export default {
  components: { LoginAuth },
  name: 'FooterSummary',
  data() {
    return {
      address: '',
      defaultObject: {},
    }
  },
  computed: {
    ...mapGetters(['open_close_cabinet']),
  },
  watch: {
    'open_close_cabinet': {
      handler(v) {
        if (v) {
          this.defaultObject = _clone(this.$store.state.currentObject)
          this.$refs.selectObject.focus()
          this.$refs.selectObject.activateMenu()
        }
      }
    }
  },
  methods: {
    resetValues() {
      setTimeout(() => {
        if (_deepEqual(this.defaultObject, this.$store.state.currentObject)) {
          this.$store.commit('change_showCabinet', false)
        }
      }, 400)
    },
    clearValues() {
      this.$nextTick(() => {
        this.$store.commit('set_currentObject', {})
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper_footer {
  padding: 10px 10px;

  .wrapper_add_object {
    display: grid;
    align-items: center;
    grid-template-columns: 1fr auto;
    grid-column-gap: 1em;

    .field_address {
      margin: unset;
      max-width: 250px;
    }

    .v-btn {
      display: flex;
      margin-left: auto;
    }
  }

  .wrapper_objects_list {
    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr auto;
    grid-column-gap: 1em;
  }

  .wrap_item_data_slot {
    display: flex;
    padding: 5px 0px;
  }

  .wrapper_selection_data {
    width: 100%;

    .wrap_item_slot {
      padding: 10px !important;
      border: 1px solid lightgrey;
      border-radius: 10px;
    }
  }
}
</style>
