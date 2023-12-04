<template>
  <div class="add_services">
    <TooltipStyled
      :is-top="true"
      :title="'Добавить услугу'"
    >
      <v-icon
        color="#95D7AE"
        size="34"
        @click="sendEventAddService"
      >
        mdi-plus-circle-outline
      </v-icon>
    </TooltipStyled>
    <v-combobox
      :hide-details="true"
      :item-text="'name'"
      :item-value="'id'"
      :items="listServicesAvailableToAdd"
      :value="selectedService"
      class="search_service"
      clearable
      hide-selected
      label="Добавить услугу"
      outlined
      placeholder="Добавить услугу"
      return-object
      solo
      @change="setService"
    />
  </div>
</template>

<script>
import TooltipStyled from "../Common/TooltipStyled.vue";

export default {
  name: "AddNewServiceButton",
  components: {
    TooltipStyled
  },
  props: {
    listServicesAvailableToAdd: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedService: null
    };
  },
  methods: {
    setService(service) {
      this.selectedService = service;
    },
    sendEventAddService() {
      this.$emit("add-service", this.selectedService);
      this.selectedService = null;
    }
  }
};
</script>

<style lang="scss" scoped>
.add_services {
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-column-gap: 5px;
}

</style>
