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
      <span>Ваш объект заполнен на - 15 %</span>
      <v-select
      v-if="$store.state.AuthModule.userData.user_data.objects.length"
      :items="$store.state.AuthModule.userData.user_data.objects"
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
    }
  },
  methods:{}
}
</script>

<style lang="scss" scoped>
.wrapper_footer{
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr;
  grid-column-gap: 1em;
  padding: 5px 10px;
}
.wrap_item_data_slot{
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
</style>
