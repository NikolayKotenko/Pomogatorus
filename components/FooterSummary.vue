<template>
  <v-footer
    padless
    fixed
    outlined
    :color="'#d3d3d3'"
    elevation="20"
    v-if="$store.getters.stateAuth"
  >
    <v-container class="wrapper_footer">
      <div class="wrapper_objects_list" v-if="$store.state.AuthModule.userData.objects.length">
        <span>Ваш объект заполнен на - 15 %</span>
        <v-select
          :items="$store.state.AuthModule.userData.objects"
          v-model="$store.state.currentObject"
          :menu-props='{
            closeOnContentClick: true,
            top: true,
            offsetY: true,
          }'
          dense
          hide-details
          placeholder='Выберите объект'
          return-object
          clearable
          solo
        >
          <template v-slot:selection='data'>
            <div class="wrapper_selection_data">
              <v-list-item-content class="wrap_item_data_slot">
                <v-list-item-title>{{ (data.item.address) ? data.item.address : 'Нет адреса'}}</v-list-item-title>
                <v-list-item-subtitle>Объект описан: {{ data.item.created_at }}</v-list-item-subtitle>
                <v-list-item-subtitle> Площадь: {{ data.item.total_area }}</v-list-item-subtitle>
              </v-list-item-content>
            </div>
          </template>

          <template v-slot:item='{ item }'>
            <v-list-item @click="$store.commit('set_currentObject', item)">
              <v-list-item-content class="wrap_item_slot">
                <v-list-item-title>{{ (item.address) ? item.address : 'Нет адреса'}}</v-list-item-title>
                <v-list-item-subtitle>Объект описан: {{ item.created_at }}</v-list-item-subtitle>
                <v-list-item-subtitle> Площадь: {{ item.total_area }}</v-list-item-subtitle>
                <v-list-item-subtitle>Готовность:</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-select>
      </div>
      <div class="wrapper_add_object"   v-else>
        <v-text-field
          class="field_address"
          flat
          placeholder="Введите адресс нового объекта"
          v-model="address"
          hide-details
          dense
          clearable
        ></v-text-field>
        <v-btn color="primary" small right @click="$store.dispatch('createNewObject', address)">Добавить объект</v-btn>
      </div>
    </v-container>
  </v-footer>
</template>

<script>
import LoginAuth from '/components/frontLayouts/LoginAuth'

export default {
  components: { LoginAuth },
  name: "FooterSummary",
  data() {
    return {
      address: '',
    }
  },
  methods:{}
}
</script>

<style lang="scss" scoped>
.wrapper_footer {
  padding: 10px 10px;

  .wrapper_add_object {
    display: grid;
    align-items: center;
    grid-template-columns: 1fr auto;
    grid-column-gap: 1em;
    .field_address{
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
    grid-template-columns: auto 1fr;
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
