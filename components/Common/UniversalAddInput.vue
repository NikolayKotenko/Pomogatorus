<template>
  <v-card class="add_services" elevation="3">
    <v-combobox
      :clearable="false"
      :hide-details="true"
      :item-text="'name'"
      :item-value="'id'"
      :items="listItemsAvailableToAdd"
      :label="listItemsAvailableToAdd.length ? 'Выбрать' : 'Нет элементов для добавления'"
      :value="selectedService"
      class="search_service"
      hide-selected
      outlined
      return-object
      solo
      @change="setService"
    >
      <template #append>
        <div class="wrapper_append">
          <IconTooltip
            :icon-text="'mdi-help-circle-outline'"
            :is-disabled="! selectedService"
            :text-tooltip="getTooltipData"
          />
          <v-icon v-show="selectedService" @click="setService(null)">
            mdi-close
          </v-icon>
        </div>
      </template>
    </v-combobox>

    <IconTooltip
      :color-icon="'#95D7AE'"
      :icon-text="'mdi-plus-circle-outline'"
      :is-disabled="! selectedService"
      :is-top-tooltip="true"
      :size-icon="'34'"
      :text-tooltip="'Добавить услугу'"
      @click-icon="sendEventAddService"
    />
  </v-card>
</template>

<script>
import IconTooltip from '../Common/IconTooltip.vue';

export default {
  name: 'UniversalAddInput',
  components: {
    IconTooltip
  },
  props: {
    listItemsAvailableToAdd: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      selectedService: null
    };
  },
  computed: {
    getTooltipData() {
      return this.selectedService?.name ? this.selectedService.name : '';
    },
    currentListServicesAvailableToAdd: {
      get() {
        if (this.listServicesAvailableToAdd.length) {
          return this.listServicesAvailableToAdd;
        }
        return this.$store.state.UserSettings.listServices;
      }
    }
  },
  async mounted() {
    if (this.listServicesAvailableToAdd.length) return false;

    if (!this.$store.state.UserSettings.listServices.length) {
      await this.$store.dispatch('UserSettings/getListServices');
    }
  },
  methods: {
    setService(service) {
      this.selectedService = service;
    },
    sendEventAddService() {
      this.$emit('add-service', this.selectedService);
      this.selectedService = null;
    }
  }
};
</script>

<style lang="scss" scoped>
.add_services {
  margin: 5px 2px;
  padding: 10px;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-column-gap: 1em;

  .search_service {
    max-width: 650px;
    border-radius: 4px !important;

    .wrapper_append {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      grid-column-gap: 5px;
    }
  }
}
</style>

<style lang="scss">
.add_services {
  .search_service {
    .v-label {
      font-size: 1.2em;
    }
  }
}
</style>
