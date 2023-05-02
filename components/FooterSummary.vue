<template>
  <VFooter
    v-if="$store.getters.stateAuth"
    :color="'#d3d3d3'"
    elevation="20"
    fixed
    outlined
    padless
  >
    <v-container class="wrapper_footer">
      <div v-if="$store.state.AuthModule.userData.objects.length" class="wrapper_objects_list">
        <span>Ваш объект заполнен на - 15 %</span>
        <VSelect
          ref="selectObject"
          v-model="$store.state.Objects.currentObject"
          :items="getItems"
          :menu-props="{
            closeOnContentClick: true,
            top: true,
            offsetY: true,
          }"
          clearable
          dense
          hide-details
          placeholder="Выберите объект"
          return-object
          solo
          @focusout="resetValues"
          @click:clear="clearValues"
        >
          <template #selection="data">
            <div class="wrapper_selection_data">
              <VListItemContent class="wrap_item_data_slot">
                <VListItemTitle>{{ (data.item.address) ? data.item.address : "Нет адреса" }}</VListItemTitle>
                <VListItemSubtitle>Объект описан: {{ data.item.created_at }}</VListItemSubtitle>
                <VListItemSubtitle> Площадь: {{ data.item.total_area }}</VListItemSubtitle>
              </VListItemContent>
            </div>
          </template>

          <template #item="{ item }">
            <VListItem @click="$store.dispatch('Objects/setCurrentObject', item)">
              <VListItemContent class="wrap_item_slot">
                <VListItemTitle>{{ (item.address) ? item.address : "Нет адреса" }}</VListItemTitle>
                <VListItemSubtitle>Объект описан: {{ item.created_at }}</VListItemSubtitle>
                <VListItemSubtitle> Площадь: {{ item.total_area }}</VListItemSubtitle>
                <VListItemSubtitle>Готовность:</VListItemSubtitle>
              </VListItemContent>
            </VListItem>
          </template>
        </VSelect>
      </div>
      <div v-else class="wrapper_add_object">
        <VTextField
          ref="createNewObj"
          v-model="address"
          class="field_address"
          clearable
          dense
          flat
          hide-details
          placeholder="Введите адресс нового объекта"
        />
        <VBtn color="primary" right small @click="$store.dispatch('Objects/createNewObject', address)">
          Добавить объект
        </VBtn>
      </div>
    </v-container>
  </VFooter>
</template>

<script>
import LoginAuth from "/components/frontLayouts/LoginAuth";
import { mapGetters } from "vuex";
import _deepEqual from "../helpers/deepCompareObjects";
import _clone from "../helpers/deepClone";

export default {
  name: "FooterSummary",
  components: { LoginAuth },
  data() {
    return {
      address: "",
      defaultObject: {}
    };
  },
  computed: {
    ...mapGetters(["open_close_cabinet"]),

    getItems() {
      return this.$store.state.AuthModule.userData.objects;
    }
  },
  watch: {
    "open_close_cabinet": {
      handler(v) {
        if (v) {
          this.defaultObject = _clone(this.$store.state.Objects.currentObject);
          if (this.$refs.selectObject) {
            this.$refs.selectObject.focus();
            this.$refs.selectObject.activateMenu();
          } else {
            this.$refs.createNewObj.focus();
          }
        }
      }
    }
  },
  methods: {
    resetValues() {
      setTimeout(() => {
        if (_deepEqual(this.defaultObject, this.$store.state.Objects.currentObject)) {
          this.$store.commit("change_showCabinet", false);
        }
      }, 400);
    },
    clearValues() {
      // this.$nextTick(() => {
      //   this.$store.commit('Objects/set_currentObject', {});
      // });
    }
  }
};
</script>

<style lang="scss" scoped>
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
