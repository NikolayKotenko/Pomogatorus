<template>
  <v-card class="map_service_area">
    <h3 class="mb-4">
      Территория обслуживания
    </h3>

    <SearchStyled
      :icon-prepend="'mdi-magnify'"
      :is-clearable="true"
      :is-custom-template-selections="true"
      :is-icon-prepend="true"
      :is-item-text="'address'"
      :is-item-value="'id'"
      :is-items="$store.state.UserSettings.listCities"
      :is-loading="$store.state.UserSettings.loading"
      :is-outlined="true"
      :is-placeholder="'Регион, город, населенный пункт'"
      :is-rounded="true"
      class="invite_input"
      @update-search-input="localGetListCities"
      @change-search="$store.dispatch('UserSettings/setSelectedCity', $event)"
    />

    <ChipsStyled
      :data="$store.getters['UserSettings/getIdsSelectedCities']"
      :is-multiple="true"
      :is-outlined="true"
      :list-chips="$store.state.UserSettings.selectedCity"
      :text-field="'city'"
      :value-field="'id'"
      class="chips_list mt-2"
      @click-chip="$store.dispatch('UserSettings/localSetChips', $event)"
    />

    <h4 class="mt-5">
      Расширение радиуса поиска, км
    </h4>
    <v-slider
      v-model="$store.state.UserSettings.selectedRange"
      :max="5"
      :tick-labels="$store.state.UserSettings.rangeArea"
      color="#95D7AE"
      thumb-color="#95D7AE"
      track-color="#95D7AE"
      track-fill-color="#95D7AE"
    />
  </v-card>
</template>

<script>
import ChipsStyled from '~/components/Common/ChipsStyled';
import SearchStyled from '~/components/Common/SearchStyled';

export default {
  name: 'MapServiceArea',
  components: { SearchStyled, ChipsStyled },
  data: () => ({}),
  computed: {},
  mounted() {

    const existedEntry = this.$store.state.AuthModule.userData.range_area;
    const userSettingsRangeArea = this.$store.state.UserSettings.rangeArea;
    if (existedEntry) {
      const indexRangeArea = userSettingsRangeArea.findIndex((elem) => elem === existedEntry);
      this.$store.state.UserSettings.selectedRange = indexRangeArea;
    }

    const existedCities = this.$store.state.AuthModule.userData.cities;
    if (existedCities) {
      this.$store.state.UserSettings.selectedCity = existedCities;
    }
  },
  methods: {
    async localGetListCities(string) {
      await this.$store.dispatch('UserSettings/getListCitiesBySearch', string);
    }
  }
};
</script>

<style lang="scss" scoped>
.map_service_area {
  margin: 10px 1px;
  padding: 10px 15px;

  .chips_list {
    font-size: 0.8em;
  }
}
</style>
